# SurgiMap

SurgiMap is a hackathon MVP for finding urgent surgical kits across connected pharmacies. Ten independent SQLite databases simulate pharmacy inventory systems, a Python sync agent normalizes and sends their stock to a central FastAPI service, and a React application shows nearby Available or Low Stock pharmacies.

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
├── compose.yaml             # Proposal-aligned central PostgreSQL service
├── docs/DEMO_SCRIPT.md
├── .gitignore
└── README.md
```

## Start the central database

The proposal architecture uses PostgreSQL for the central inventory. Start it with:

```bash
docker compose up -d postgres
cp backend/.env.example backend/.env
```

For a zero-setup local fallback, leave `backend/.env` absent; the backend then uses `backend/surgimap.db` automatically. The ten simulated pharmacy databases remain SQLite in both modes.

## Run the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`

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

Location-aware search example:

```text
GET http://127.0.0.1:8000/search?item_name=caesarean&user_latitude=6.8649&user_longitude=79.8997
```

When both coordinates are supplied, results are sorted nearest-first and include `distance_km`. Without them, results fall back to stock-level and pharmacy-name ordering. Zero-stock pharmacies are never returned.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

The frontend connects to the backend at `http://127.0.0.1:8000` by default.
For another backend URL, copy `frontend/.env.example` to `frontend/.env` and
change `VITE_API_BASE_URL` before starting Vite.

The browser asks for location permission on the first search. If permission is granted, results show distance and are sorted nearest-first. If permission is denied, search, map, Call, and WhatsApp still work without distance sorting.

Authentication and pharmacy/admin dashboards are future scope in this MVP. Earlier UI concepts remain in the source tree for later development, but they are not exposed as application routes and no mock login is presented to users.

## Tests

```bash
cd backend
pytest -q

cd ../frontend
npm run build
npm run lint
```
