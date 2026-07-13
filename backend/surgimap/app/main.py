
from fastapi import FastAPI
from app.database import engine, Base
from app.routers import pharmacies, search, stock, sync

app = FastAPI(
    title="SurgiMap API",
    description="Surgical kit stock search across pharmacies — HackElite 3.0",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)  

# Register routers — this is how FastAPI knows about your endpoints
app.include_router(pharmacies.router)
app.include_router(search.router)
app.include_router(stock.router)
app.include_router(sync.router)

@app.get("/")
def root():
    return {"status": "SurgiMap API is running"}



