import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# Get database URL from .env, default to local SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./bizeye.db")

# Handle unencoded '@' in database passwords if present
if "postgresql://" in DATABASE_URL:
    prefix = "postgresql://"
    body = DATABASE_URL[len(prefix):]
    if body.count("@") > 1:
        credentials, host_part = body.rsplit("@", 1)
        if ":" in credentials:
            user, password = credentials.split(":", 1)
            password_encoded = password.replace("@", "%40")
            DATABASE_URL = f"{prefix}{user}:{password_encoded}@{host_part}"

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
