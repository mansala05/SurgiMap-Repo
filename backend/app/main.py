"""Stable Uvicorn entry point for the presentation tier."""
from app.presentation.api import app, lifespan, root, health
