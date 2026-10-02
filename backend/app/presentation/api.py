"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.data.database import initialize_database
from app.data.repositories import InventoryRepository
from app.business.errors import ApplicationError
from app.business.health import health as check_health
from app.presentation.dependencies import get_repository
from app.presentation.routers import auth, pharmacies, search, sync


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
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
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pharmacies.router)
app.include_router(search.router)
app.include_router(sync.router)
app.include_router(auth.router)


@app.get("/")
def root():
    return {"status": "SurgiMap API is running", "docs": "/docs"}


@app.get("/health")
def health(repository: InventoryRepository = Depends(get_repository)):
    return check_health(repository)


@app.exception_handler(ApplicationError)
async def application_error_handler(_: Request, exc: ApplicationError):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail}, headers=exc.headers)
