"""Guard tier boundaries and behavior at the extracted persistence boundary."""
import ast
from pathlib import Path


def test_tier_import_boundaries():
    root = Path(__file__).resolve().parents[1] / "app"
    forbidden = {
        "business": ("fastapi", "sqlalchemy", "app.presentation", "app.routers", "app.data"),
        "data": ("fastapi", "app.presentation", "app.routers", "app.business"),
    }
    for tier, prefixes in forbidden.items():
        for path in (root / tier).rglob("*.py"):
            for node in ast.walk(ast.parse(path.read_text())):
                imports = []
                if isinstance(node, ast.Import):
                    imports = [alias.name for alias in node.names]
                elif isinstance(node, ast.ImportFrom):
                    imports = [node.module or ""]
                    imports += [f"{node.module}.{alias.name}" for alias in node.names]
                assert not any(
                    name == prefix or name.startswith(prefix + ".")
                    for name in imports for prefix in prefixes
                ), f"{path}: {imports} crosses the {tier} boundary"
    for path in (root / "presentation").rglob("*.py"):
        tree = ast.parse(path.read_text())
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
                assert node.func.attr not in {"query", "commit", "rollback", "flush", "execute"}, path


def test_legacy_imports_share_canonical_objects():
    from app import models, schemas, database
    from app.data import models as canonical_models, database as canonical_database
    from app.business import contracts, master_catalog
    from app.services import master_catalog as legacy_catalog
    from app.main import app
    from app.presentation.api import app as canonical_app
    assert models.Stock is canonical_models.Stock
    assert database.Base is canonical_database.Base
    assert database.get_db is canonical_database.get_db
    assert schemas.InventorySyncItem is contracts.InventorySyncItem
    assert legacy_catalog.normalize_item_name is master_catalog.normalize_item_name
    assert app is canonical_app


def test_sync_rolls_back_unknown_pharmacy_and_persistence_failure(monkeypatch):
    from fastapi.testclient import TestClient
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy.pool import StaticPool
    from app.main import app
    from app.data.database import Base, get_db
    from app.data.models import Pharmacy, SurgicalKit, Stock
    from app.data.repositories import InventoryRepository
    from app.business.sync import SYNC_API_KEY

    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    sessions = sessionmaker(bind=engine)
    with sessions() as db:
        db.add(Pharmacy(id=1, name="Rollback pharmacy", address="Test address"))
        db.commit()

    def test_db():
        with sessions() as db:
            yield db

    app.dependency_overrides[get_db] = test_db
    item = {
        "pharmacy_id": 1, "local_item_name": "C Section Kit",
        "standard_item_name": "untrusted", "quantity": 5,
        "status": "untrusted", "last_updated": "2026-07-16T12:00:00",
    }
    headers = {"X-Sync-Key": SYNC_API_KEY}
    try:
        with TestClient(app) as client:
            response = client.post("/sync/inventory", json=[item, {**item, "pharmacy_id": 999}], headers=headers)
            assert response.status_code == 400
            assert response.json()["detail"] == "Unknown pharmacy_id: 999. Seed pharmacies first."
            with sessions() as db:
                assert db.query(Stock).count() == 0
                assert db.query(SurgicalKit).count() == 0

            def failed_commit(self):
                raise RuntimeError("simulated persistence failure")

            with monkeypatch.context() as patch:
                patch.setattr(InventoryRepository, "commit", failed_commit)
                response = client.post("/sync/inventory", json=[item], headers=headers)
                assert response.status_code == 500
                assert response.json() == {"detail": "Inventory sync failed"}
            with sessions() as db:
                assert db.query(Stock).count() == 0
                assert db.query(SurgicalKit).count() == 0

            assert client.post("/sync/inventory", json=[item], headers=headers).status_code == 200
            expected = client.get("/search", params={"item_name": "CSK"}).json()
            assert expected and expected[0]["status"] == "Available"
            for parameter in ("q", "kit_name"):
                assert client.get("/search/", params={parameter: "CSK"}).json() == expected
            assert client.get("/pharmacies").json() == client.get("/pharmacies/").json()
    finally:
        app.dependency_overrides.pop(get_db, None)
        engine.dispose()
