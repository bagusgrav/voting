# Repository Memory

## Project scope

This repository is an educational voting-auditability prototype, not a system
for real elections. Avoid claims that the current implementation guarantees
ballot secrecy, integrity, or production readiness.

## Components

- `api/`: Rust/Axum API and SQLx/SQLite storage.
- `frontend/`: Next.js/TypeScript UI.
- `verifier/`: Python verification prototype.
- `docs/`: design and threat-model documentation.

## Invariants

- Single Door Policy: Dilarang membuat form login lokal. Autentikasi wajib via
  Thort ID SSO (`thort_sso_token`).
- Database: SQLite WAL mode, path wajib di
  `/var/data/voting/central.sqlite`. PRAGMA synchronous=NORMAL,
  busy_timeout=5000.
- Resiliensi: Frontend wajib pakai `fetchWithRetry`. Backend wajib idempoten.

For vote submission, a duplicate nullifier returns HTTP 200 with
`{"status":"already_voted"}` and does not create a second record.
