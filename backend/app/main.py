"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app import models
from app.database import Base, SessionLocal, engine, get_db
from app.routers import pharmacies, search, sync
from app.seed import seed_demo_pharmacies


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_demo_pharmacies(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="SurgiMap API",
    description="Surgical kit stock search across connected pharmacies.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pharmacies.router)
app.include_router(search.router)
app.include_router(sync.router)


@app.get("/")
def root():
    return {"status": "SurgiMap API is running", "docs": "/docs"}


@app.get("/health")
def health(db: Session = Depends(get_db)):
    # This endpoint performs a real database round-trip.
    db.execute(text("SELECT 1"))
    return {"status": "healthy", "database": "connected"}
