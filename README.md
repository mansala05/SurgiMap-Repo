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

The sync endpoint requires the `X-Sync-Key` header. The sync agent reads the same `SURGIMAP_SYNC_API_KEY` value from `backend/.env` automatically. Change the example key before any shared or deployed demo. The backend recalculates canonical kit names and stock statuses instead of trusting submitted values, rejects duplicate batch entries, and limits each request to 500 items. Direct public stock mutation routes are not exposed.

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

Search accepts canonical names, local pharmacy aliases, partial phrases, common spelling variations, and catalog codes such as `CSK`, `ASK`, `GSK`, `STP`, and `DRK`. When no stocked item matches, `GET /search/suggestions?q=...` returns the closest searchable kit names.

## Run the frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend URL: `http://localhost:5173`

The frontend connects to the backend at `http://127.0.0.1:8000` by default. For
another backend URL, change `VITE_API_BASE_URL` before starting Vite.

The results map uses the Google Maps JavaScript API. Enable that API in a Google
Cloud project, place a browser-restricted key in `VITE_GOOGLE_MAPS_API_KEY`, and
set `VITE_GOOGLE_MAP_ID` when using your own map ID. `DEMO_MAP_ID` is suitable for
local development. Restrict the browser key to the frontend's HTTP referrers
before sharing or deploying the demo. If no key is configured, the page shows a
safe setup message and still offers an external Google Maps link.

The browser asks for location permission on the first search. Users can retry
current-location detection or select Colombo, Nugegoda, Dehiwala, Maharagama, or
Battaramulla manually. When a location is available, the backend calculates the
straight-line distance and returns pharmacies nearest-first. Google Maps provides
the interactive marker map and driving directions; the displayed sorting distance
is not road-travel distance. Without a location, search, map, Call, WhatsApp, and
Directions still work without distance sorting.

Authentication and pharmacy/admin dashboards are future scope in this MVP. Mock operational portals are not included, so the demo does not present unfinished login or authorization behavior to users.

## Tests

```bash
cd backend
pytest -q

cd ../frontend
npm run build
npm run lint
```
