# database.py
# This file does two things:
#   1. Creates the "engine" — the connection to your PostgreSQL database
#   2. Provides a session factory so each API request gets its own DB connection

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Load the DATABASE_URL from your .env file
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# The engine is SQLAlchemy's way of talking to PostgreSQL
engine = create_engine(DATABASE_URL)

# SessionLocal is a factory — calling SessionLocal() gives you a DB session
# autocommit=False means changes are not saved until you call session.commit()
# autoflush=False means SQLAlchemy won't auto-write to DB mid-request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the parent class all your models (tables) will inherit from
Base = declarative_base()


# This is a "dependency" — FastAPI calls this function for every request
# that needs a DB session, and automatically closes it when the request ends
def get_db():
    db = SessionLocal()
    try:
        yield db          # give the session to the route handler
    finally:
        db.close()        # always close, even if an error occurred
