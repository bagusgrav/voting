# Architecture

This project is an educational prototype for voting auditability, not a
production-ready voting system.

## Components and responsibilities

- **Frontend (`frontend/`)**: Next.js/TypeScript interface for the voter flow.
- **API (`api/`)**: Rust/Axum service that accepts and lists submitted ballots.
- **Database**: SQLite persistence managed through SQLx.
- **Verifier (`verifier/`)**: independent Python tool intended to check exported
  records and recompute results.

The design separates eligibility/credential issuance from ballot submission
and verification. Refer to [docs/design.md](docs/design.md) and
[docs/threat-model.md](docs/threat-model.md) for design assumptions and known
limitations.

## Invariants

- Single Door Policy: Dilarang membuat form login lokal. Autentikasi wajib via
  Thort ID SSO (`thort_sso_token`).
- Database: SQLite WAL mode, path wajib di
  `/var/data/voting/central.sqlite`. PRAGMA synchronous=NORMAL,
  busy_timeout=5000.
- Resiliensi: Frontend wajib pakai `fetchWithRetry`. Backend wajib idempoten.

The vote API treats a repeated nullifier as an idempotent submission: it
responds with HTTP 200 and `{"status":"already_voted"}` without adding another
ballot. These invariants do not, by themselves, establish election security.
