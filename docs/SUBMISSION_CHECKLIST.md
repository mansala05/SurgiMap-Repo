# HackElite 3.0 Phase 2 Submission Checklist

Team: **Shadow Stack**  
Project: **SurgiMap**  
Track: **Software Only**

## Prepared in this repository

- [x] Working MVP aligned with the proposed pharmacy-inventory sync architecture.
- [x] Public repository URL is included in `README.md`.
- [x] Dependencies, build artifacts, virtual environments, and real `.env` files are excluded.
- [x] Example environment files are included for backend and frontend.
- [x] README includes tech stack, deployment, architecture, challenges, scope, deviations, limitations, and run commands.
- [x] Software Instructions PDF is named `ShadowStack.pdf` and begins with the required GitHub clone instruction.
- [x] Corrected 7–10 minute demo script is included.
- [x] Backend tests, frontend lint, and frontend production build are documented.
- [x] A clean code archive can be generated as `ShadowStack_code.zip`.

## Must be completed by a team member before submission

- [ ] Record a **7–10 minute** video showing the working MVP, not only slides.
- [ ] Upload the video to YouTube with judge-accessible visibility.
- [ ] Replace the pending video line in `README.md` with the final YouTube URL.
- [ ] Push the final verified commit to the public GitHub repository.
- [ ] Open the repository and video in a private/incognito browser to confirm judge access.
- [ ] Confirm `ShadowStack.pdf` opens and its commands work on the final submitted code.
- [ ] Enter the team participation code exactly as registered in Devpost.
- [ ] Enter the team leader email exactly as registered.
- [ ] Use the official Devpost submission link and submit only once for the team.
- [ ] Complete all actions before the deadline in the official guide.

## Final smoke test

1. Start the project with `./start.sh`.
2. Confirm API health at <http://127.0.0.1:8000/health>.
3. Search `Orthopedic & Major Joint Surgery Prep Kit` and confirm results appear.
4. Confirm result images, different pharmacy presentation images, freshness badges, Call, WhatsApp, map, and directions.
5. Change one source quantity using `scripts.update_demo_stock` and confirm it appears within 30 seconds.
6. Sign in to the pharmacy monitor and confirm its inventory matches central search data.
7. Stop with `Ctrl+C`; confirm all three processes exit.

## Submission-package exclusions

Do not include `.git/`, `.env`, `node_modules/`, `.venv/`, `dist/`, caches, temporary PDFs/renders, or generated `sync_payload.json`. Keep source code, lockfiles, `.env.example` files, the ten demo database files, central demo database, docs, and final PDF.
