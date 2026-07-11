# main.py
# This is the entry point of your FastAPI app.
# It creates the app, connects the routers, and creates DB tables on startup.

from fastapi import FastAPI
from app.database import engine, Base
from app.routers import pharmacies, search,stock,sync
from fastapi.middleware.cors import CORSMiddleware


# Create all tables in PostgreSQL if they don't already exist
# Once Nimsara's sync agent starts writing data, the tables are ready
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SurgiMap API",
    description="Surgical kit stock search across pharmacies — HackElite 3.0",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['http://localhost:5173'],  #pabarusiri's React dev server
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

# Register routers — this is how FastAPI knows about your endpoints
app.include_router(pharmacies.router)
app.include_router(search.router)
app.include_router(stock.router)
app.include_router(sync.router)

@app.get("/")
def root():
    """Health check — visit this URL to confirm the server is running."""
    return {"status": "SurgiMap API is running"}
