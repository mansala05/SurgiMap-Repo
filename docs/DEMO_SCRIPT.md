# SurgiMap — 8-Minute Demo Script

**Team Shadow Stack · HackElite 3.0 Phase 2**

## 0:00–0:45 — Problem and outcome

Hello, we are Team Shadow Stack, and this is SurgiMap.

When a patient urgently needs a surgical kit, relatives may have to call or visit several pharmacies before finding stock. SurgiMap turns that stressful manual search into one location-aware search across connected pharmacy inventories.

This is a working software-only MVP. It shows where a kit is Available or Low Stock, how recently each pharmacy synced, and gives the user Call, WhatsApp, map, and directions actions. Because stock changes quickly, the interface always recommends verifying by phone before travelling.

## 0:45–1:35 — Architecture

The demo has ten independent SQLite databases representing ten pharmacy inventory systems. Each contains 59 kits and surgical items, for 590 source records in total.

A Python local sync agent polls all ten sources every 30 seconds. It tolerates one unavailable pharmacy, normalizes different local names through a 396-alias master catalog, and sends a protected batch to FastAPI.

The backend validates the batch again, derives the official name and stock status itself, and stores unified inventory centrally. PostgreSQL is supported for the proposed architecture; SQLite is the zero-setup judging fallback. A React and TypeScript web app then serves patient search and an authenticated, read-only pharmacy inventory monitor.

## 1:35–2:10 — Start and health check

From the project root, we run `./start.sh`. One command starts FastAPI, the React frontend, and the automatic sync agent.

The terminal confirms the API on port 8000, the frontend on port 5173, and a 30-second inventory interval. We open `/health` to show that the API is running and the central database connection is healthy. We can also open `/docs` to show the generated API contract.

## 2:10–4:10 — Patient search flow

We open the SurgiMap home page and search for `caesarean`. The term is an alias, so the master catalog resolves it to the full Maternity and Cesarean Section Delivery Kit.

The browser can use our current location, or we can select a demo area. With a location, the backend calculates distance and returns the nearest matching pharmacies first. Without location permission, the core search still works.

The page returns only pharmacies with stock. Exact quantities are intentionally hidden from patients; each result shows Available or Low Stock, contact details, distance where available, and a sync health label. “Live” means the pharmacy was received within the expected sync window. A delayed or offline label tells the user that verification is especially important.

Open the map to show the same live results as markers. Then return to a result card and show Call, WhatsApp, and directions. These are working links generated from each pharmacy’s data.

Next, search with the short code `CSK`, a spelling variation such as `cesareen`, and an individual item such as `trocar 10mm`. This demonstrates alias, typo, short-code, and partial-item matching. A bad query shows useful suggestions instead of a blank dead end.

## 4:10–5:25 — Automatic stock update

Now we prove that the inventory is not hard-coded in the browser.

In another terminal, from `backend`, we run:

```bash
source .venv/bin/activate
python -m scripts.update_demo_stock \
  --pharmacy 1 \
  --item "Laparoscopic / Abdominal Surgery Kit" \
  --quantity 2
```

We do not run a manual sync. The existing agent detects the source change on its next 30-second cycle. Search for the Laparoscopic / Abdominal Surgery Kit and watch the result refresh automatically. Pharmacy 1 moves to Low Stock, and the freshness label changes to a new successful sync time.

This also demonstrates why different concepts are separated: source quantity is the business data, while last sync time tells us whether the connector is healthy.

## 5:25–6:15 — Pharmacy monitor

Open `/login` and use the demo credentials from the README. The API checks the credentials and creates a signed, expiring pharmacy session.

The pharmacy monitor reads the signed-in pharmacy’s real inventory from the central database. Its Available, Low Stock, and Unavailable totals come from synced rows, and it refreshes every 30 seconds. It is intentionally read-only: pharmacy staff change stock in their existing source system, and SurgiMap receives it through the same auditable sync path rather than creating a second source of truth.

## 6:15–7:15 — Reliability and technical depth

There are four important engineering decisions behind the demo.

First, canonical normalization makes independently named inventory searchable as one catalog. Second, the backend never trusts the browser or agent-provided status; it validates and recalculates stock state. Third, batch updates are transactional, duplicate entries are rejected, and a failed batch rolls back. Fourth, one missing pharmacy file is reported and skipped without stopping the other nine sources.

The sync endpoint is protected with a server-side API key. Patient users have no public stock mutation route. The pharmacy monitor uses signed eight-hour sessions, and all secrets can be replaced through environment variables.

## 7:15–8:00 — Scope, impact, and close

This phase fully delivers the proposed discovery loop: independent pharmacy sources, automatic normalization and sync, central search, live freshness, location-aware results, map, contact actions, and a connected pharmacy monitor.

The current sources are simulated SQLite databases because real pharmacy POS access was unavailable during the hackathon. PostgreSQL support and clean API boundaries show how those adapters can be replaced. Reservations, payments, delivery, and clinical recommendations are deliberately outside this MVP.

SurgiMap reduces the number of calls and trips families make while keeping the final safety check with the pharmacy. Thank you.

## Recording checklist

- Keep the final video between 7 and 10 minutes.
- Show the running product for most of the video; do not rely only on slides.
- Keep the terminal text large enough to read.
- Demonstrate one automatic update without manually running the sync agent.
- Do not show real `.env` values, tokens, or personal accounts.
- End with the repository link and place the public YouTube URL in `README.md`.
