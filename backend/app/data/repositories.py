"""Central inventory persistence. SQL and transaction operations belong here."""
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.data import models


class InventoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def health(self):
        self.db.execute(text("SELECT 1"))

    def list_pharmacies(self):
        return self.db.query(models.Pharmacy).order_by(models.Pharmacy.id).all()

    def search_stock(self, matching_names, normalized_query):
        query = (self.db.query(models.Stock).join(models.Pharmacy)
                 .join(models.SurgicalKit).filter(models.Stock.quantity > 0))
        if matching_names:
            query = query.filter(models.SurgicalKit.standard_name.in_(matching_names))
        else:
            query = query.filter(models.SurgicalKit.standard_name.ilike(f"%{normalized_query}%"))
        return query.all()

    def available_names(self):
        return [name for (name,) in (self.db.query(models.SurgicalKit.standard_name)
                .join(models.Stock).filter(models.Stock.quantity > 0).distinct().all())]

    def log_search(self, query, count):
        self.db.add(models.SearchLog(query_text=query, result_count=count))
        self.db.commit()

    def pharmacy_inventory(self, pharmacy_id):
        return (self.db.query(models.Stock).join(models.SurgicalKit)
                .filter(models.Stock.pharmacy_id == pharmacy_id)
                .order_by(models.SurgicalKit.standard_name).all())

    def pharmacy_exists(self, pharmacy_id):
        return self.db.get(models.Pharmacy, pharmacy_id) is not None

    def get_or_create_kit(self, standard_name):
        kit = self.db.query(models.SurgicalKit).filter(
            models.SurgicalKit.standard_name == standard_name).first()
        if kit is None:
            kit = models.SurgicalKit(standard_name=standard_name)
            self.db.add(kit)
            self.db.flush()
        return kit

    def upsert_stock(self, pharmacy_id, kit_id, quantity, status, received_at):
        row = self.db.query(models.Stock).filter(
            models.Stock.pharmacy_id == pharmacy_id, models.Stock.kit_id == kit_id).first()
        if row is None:
            self.db.add(models.Stock(pharmacy_id=pharmacy_id, kit_id=kit_id,
                        quantity=quantity, status=status, last_updated=received_at))
            return True
        row.quantity = quantity
        row.status = status
        row.last_updated = received_at
        return False

    def commit(self):
        self.db.commit()

    def rollback(self):
        self.db.rollback()
