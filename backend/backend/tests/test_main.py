import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup environment variables before imports
os.environ["DATABASE_URL"] = "sqlite:///./test_surgimap.db"
os.environ["SYNC_API_USERNAME"] = "test_agent"
os.environ["SYNC_API_PASSWORD"] = "test_pass"

from app.database import Base, get_db
from app.main import app

# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_surgimap.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables/cleanup test database file
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    try:
        from app.database import engine as app_engine
        app_engine.dispose()
    except Exception:
        pass
    
    if os.path.exists("./test_surgimap.db"):
        try:
            os.remove("./test_surgimap.db")
        except PermissionError:
            pass



def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to the SurgiMap Central API!" in response.json()["message"]

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "database": "connected"}

def test_sync_unauthorized():
    payload = {
        "pharmacy_name": "Test Pharmacy",
        "latitude": 6.9,
        "longitude": 79.9,
        "stocks": [{"kit_name": "General Surgery Kit", "quantity": 5}]
    }
    response = client.post("/sync", json=payload)
    assert response.status_code == 401

def test_sync_authorized():
    payload = {
        "pharmacy_name": "Test Pharmacy",
        "latitude": 6.9,
        "longitude": 79.9,
        "phone": "+94770000000",
        "whatsapp": "+94770000000",
        "stocks": [
            {"kit_name": "General Surgery Kit", "quantity": 5},
            {"kit_name": "Orthopedic Surgical Kit", "quantity": 2},
            {"kit_name": "Dental Kit", "quantity": 0}  # Out of stock
        ]
    }
    # Using correct credentials
    response = client.post("/sync", json=payload, auth=("test_agent", "test_pass"))
    assert response.status_code == 200
    assert "success" in response.json()["status"]

def test_search_results():
    # Searching for general surgical kits
    response = client.get("/search?q=General")
    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["pharmacy_name"] == "Test Pharmacy"
    assert results[0]["quantity"] == 5
    assert results[0]["status"] == "Available"

    # Searching for orthopedic surgical kit (quantity 2, should be Low Stock)
    response = client.get("/search?q=Orthopedic")
    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["quantity"] == 2
    assert results[0]["status"] == "Low Stock"

    # Searching for out-of-stock dental kit (quantity 0, should not appear in search results)
    response = client.get("/search?q=Dental")
    assert response.status_code == 200
    results = response.json()
    assert len(results) == 0

def test_search_empty_query():
    response = client.get("/search?q=")
    assert response.status_code == 400

def test_list_pharmacies():
    response = client.get("/pharmacies")
    assert response.status_code == 200
    pharmacies = response.json()
    assert len(pharmacies) == 1
    assert pharmacies[0]["name"] == "Test Pharmacy"
