"""Database health use case."""

def health(repository):
    repository.health()
    return {"status": "healthy", "database": "connected"}
