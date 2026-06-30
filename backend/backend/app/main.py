import os
import secrets
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .database import engine, get_db

# Create the database tables on startup
# (Usually we would use Alembic for migrations, but for a prototype this is perfect and reliable)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SurgiMap Central API",
    description="Central backend API for the SurgiMap surgical kit locator system.",
    version="1.0.0"
)

# Enable CORS (Cross-Origin Resource Sharing)
# This allows our React frontend to communicate with the FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL (e.g., http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HTTP Basic Authentication setup for Sync Agent
security = HTTPBasic()

def authenticate_sync_agent(credentials: HTTPBasicCredentials = Depends(security)):
    expected_username = os.getenv("SYNC_API_USERNAME", "sync_agent")
    expected_password = os.getenv("SYNC_API_PASSWORD", "supersecretpassword")
    
    is_correct_username = secrets.compare_digest(credentials.username, expected_username)
    is_correct_password = secrets.compare_digest(credentials.password, expected_password)
    
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Sync credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


# --- Endpoints ---

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the SurgiMap Central API!",
        "docs_url": "/docs"
    }


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Perform a simple query to verify database connection
        db.execute(models.Base.metadata.tables["pharmacies"].select().limit(1))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection failed: {str(e)}"
        )


@app.post("/sync", status_code=status.HTTP_200_OK)
def sync_stock(
    payload: schemas.SyncPayload,
    db: Session = Depends(get_db),
    username: str = Depends(authenticate_sync_agent)
):
    """
    Sync endpoint used by the Python Local Sync Agent.
    Requires HTTP Basic Authentication.
    """
    return crud.sync_pharmacy_stocks(db, payload)


@app.get("/search", response_model=List[schemas.SearchResultItem])
def search_kits(q: str = "", db: Session = Depends(get_db)):
    """
    Search endpoint used by the React Frontend.
    Returns pharmacies with positive stock levels matching the kit query.
    """
    if not q.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query cannot be empty"
        )
    return crud.search_kits_by_name(db, q)


@app.get("/pharmacies", response_model=List[schemas.Pharmacy])
def list_pharmacies(db: Session = Depends(get_db)):
    """
    Lists all pharmacies registered in the central system.
    """
    return crud.get_all_pharmacies(db)


@app.get("/kits")
def list_kits(db: Session = Depends(get_db)):
    """
    Lists all surgical kits in the master catalog.
    """
    kits = db.query(models.SurgicalKit).all()
    return [{"id": kit.id, "standard_name": kit.standard_name} for kit in kits]
