# SurgiMap

SurgiMap is a hackathon MVP for finding surgical kits across connected pharmacies. The cleaned project contains one FastAPI backend, one React frontend, and a ten-database SQLite demo dataset.

## Project structure

```text
SurgiMap_Cleaned/
├── backend/
│   ├── app/                 # Single canonical FastAPI application
│   │   ├── routers/         # Search, sync, stock, pharmacy endpoints
│   │   └── services/        # Item-name normalization catalog
│   ├── data/                # 10 simulated pharmacy SQLite databases
│   ├── scripts/             # Demo database, sync, and stock-update tools
│   ├── tests/               # Backend smoke test
│   ├── .env.example
│   └── requirements.txt
├── frontend/                # React + TypeScript + Vite
├── docs/DEMO_SCRIPT.md
├── .gitignore
└── README.md
```

## Run the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`

The local demo uses SQLite automatically. To use PostgreSQL, copy `.env.example` to `.env` and replace `DATABASE_URL`.

## Sync the demo inventory

Open a second terminal from `backend/`:

```bash
source .venv/bin/activate
python -m scripts.sync_agent
```

This reads all ten files in `backend/data/`, normalizes local kit names, and sends 50 records to `POST /sync/inventory`.

Regenerate the local databases when needed:

```bash
python -m scripts.create_demo_databases
```

Change one stock value for the live-sync demonstration:

```bash
python -m scripts.update_demo_stock --pharmacy 1 --item "C Section Kit" --quantity 2
python -m scripts.sync_agent
```

Search example:

```text
GET http://127.0.0.1:8000/search?item_name=c%20section%20kit
```

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Tests

```bash
cd backend
pytest -q
```

## Cleanup decisions

Removed duplicate backend iterations, duplicate root scripts and databases, macOS metadata, Python caches, generated payload/build folders, and Magic Patterns canvas-only helper files. The richer item-name catalog was retained and moved into the canonical backend service layer.
