# SurgiMap

SurgiMap is a hackathon MVP for finding urgent surgical kits across connected pharmacies. Ten independent SQLite databases simulate pharmacy inventory systems, a Python sync agent normalizes and sends their stock to a central FastAPI service, and a React application shows nearby Available or Low Stock pharmacies.

## Quick start

After installing the backend and frontend dependencies once (see below), start
the complete local project from the repository root with:

```bash
./start.sh
```

This starts the API and frontend together and uses the included SQLite database,
so Docker is not required. Open `http://localhost:5173`. Press Ctrl+C to stop
both servers. To use another database, supply `DATABASE_URL` when launching the
script.

## Project structure

```text
SurgiMap_Cleaned/
├── backend/
│   ├── app/                 # Single canonical FastAPI application
│   │   ├── routers/         # Auth, search, sync, and pharmacy endpoints
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
python -m scripts.sync_agent --watch
```

Automatic mode syncs immediately and then repeats every 30 seconds. Change the
interval with `--interval 10` or the `SURGIMAP_SYNC_INTERVAL_SECONDS` environment
variable. Press Ctrl+C to stop it. Running `./start.sh` starts this automatic sync
process together with the backend and frontend.

Each sync reads all ten files in `backend/data/`, normalizes local item names, and sends 590 records to `POST /sync/inventory`. The expanded master catalog contains 59 canonical kits and surgical items with 396 patient/pharmacy aliases. A one-time manual sync remains available with `python -m scripts.sync_agent`.

The sync endpoint requires the `X-Sync-Key` header. The sync agent reads the same `SURGIMAP_SYNC_API_KEY` value from `backend/.env` automatically. Change the example key before any shared or deployed demo. The backend recalculates canonical item names and stock statuses instead of trusting submitted values, rejects duplicate batch entries, and limits each request to 1,000 items. Direct public stock mutation routes are not exposed.

Rebuild all ten local pharmacy databases and the central SQLite demo database when needed:

```bash
python -m scripts.create_demo_databases
```

Change one stock value for the live-sync demonstration:

```bash
python -m scripts.update_demo_stock --pharmacy 1 --item "C Section Kit" --quantity 2
```

To set the same item quantity across all ten simulated pharmacy databases:

```bash
python -m scripts.update_demo_stock --all-pharmacies --item "C Section Kit" --quantity 2
```

Bulk demo updates use pharmacy-specific timestamps so search results resemble
independent inventory systems. To refresh those demo timestamps without changing
quantities, run:

```bash
python -m scripts.update_demo_stock --all-pharmacies --item "Orthopedic & Major Joint Surgery Prep Kit" --refresh-only
```

To refresh realistic timestamps across the complete 590-record demo inventory
without changing any quantities:

```bash
python -m scripts.refresh_demo_freshness
```

When automatic sync is running, the updated quantity appears in search within the
configured interval. Run `python -m scripts.sync_agent` afterward only when using
one-time manual mode.

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

The results page uses OpenStreetMap tiles through Leaflet, so no browser API key
is required. Pharmacy markers, the selected user location, and route links are
rendered directly from the live backend search response. Keep the visible
OpenStreetMap attribution when changing the map layout or tile provider.

The browser asks for location permission on the first search. Users can retry
current-location detection or select Colombo, Nugegoda, Dehiwala, Maharagama, or
Battaramulla manually. When a location is available, the backend calculates the
straight-line distance and returns pharmacies nearest-first. OpenStreetMap provides
the interactive marker map and OSRM-powered route links; the displayed sorting distance
is not road-travel distance. Without a location, search, map, Call, WhatsApp, and
Directions still work without distance sorting.

The pharmacy portal is available at `http://localhost:5173/login`. For the local
demo, use `pharmacy@surgimap.lk` / `pharmacy123`, or choose **Fill demo
credentials** on the sign-in screen. The API validates the credentials and issues
an eight-hour signed pharmacy session; `/pharmacy/dashboard` redirects unsigned or
expired sessions back to login. Set `SURGIMAP_PHARMACY_EMAIL`,
`SURGIMAP_PHARMACY_PASSWORD`, and `SURGIMAP_AUTH_SECRET` in `backend/.env` before
using the portal outside local development.

## Tests

```bash
cd backend
pytest -q

cd ../frontend
npm run build
npm run lint
```
