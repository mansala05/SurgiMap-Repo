from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import pharmacies, search, stock, sync

app = FastAPI(
    title="SurgiMap API",
    description="Surgical kit stock search across pharmacies — HackElite 3.0",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)  

app.include_router(pharmacies.router)
app.include_router(search.router)
app.include_router(stock.router)
app.include_router(sync.router)

@app.get("/")
def root():
    return {"status": "SurgiMap API is running"}