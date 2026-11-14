# Ecosystem

This repository is an educational prototype for voting auditability, not a
production election system. See [README.md](README.md) for scope and
[docs/design.md](docs/design.md) for the design overview.

## Components

- `api/`: Rust/Axum HTTP API, SQLx persistence, and cryptographic experiments.
- `frontend/`: Next.js and TypeScript user interface.
- `verifier/`: independent Python verification tool.
- `docs/`: design and threat-model documentation.

## Invariants

- Single Door Policy: Dilarang membuat form login lokal. Autentikasi wajib via
  Thort ID SSO (`thort_sso_token`).
- Database: SQLite WAL mode, path wajib di
  `/var/data/voting/central.sqlite`. PRAGMA synchronous=NORMAL,
  busy_timeout=5000.
- Resiliensi: Frontend wajib pakai `fetchWithRetry`. Backend wajib idempoten.

These are architectural requirements. The prototype's implementation and
deployment must be checked against them before any production use.
