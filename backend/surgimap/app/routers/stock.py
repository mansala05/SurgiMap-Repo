from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models 
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix='/stock', tags=['stock'])

class StockUpsert(BaseModel):
        pharmacy_id:int
        kit_id: int
        quantity:int
        
def compute_status(qty: int) -> str:
    if qty > 5: return 'Available'
    elif qty > 0: return 'Low Stock'
    else: return 'Not Available'
    
@router.post('/upsert')
def upsert_stock (data: StockUpsert, db: Session = Depends (get_db)):
    row = db.query(models.Stock).filter_by(
        pharmacy_id = data.pharmacy_id, kit_id = data.kit_id).first()
    if row:
        row.quantity = data.quantity
        row.status = compute_status(data.quantity)
        row.last_updated = datetime.utcnow()
    else: 
        row = models.Stock(
            pharmacy_id = data.pharmacy_id, kit_id = data.kit_id,
            quantity = data.quantity, status = compute_status(data.quantity)
        )
        db.add(row)
    db.commit()
    return {'message': 'Stock update'}
    