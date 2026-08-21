# TorrentEdge Auth Service

A small, real auth microservice backing the login UI preview on the
[TorrentEdge](https://github.com/Shaurya55555/TorrentEdge) showcase page.

Implements the same register/login logic as TorrentEdge's `authController.js`
(bcrypt password hashing, JWT issuance) but uses a lightweight JSON file store
instead of MongoDB, since this service runs on a free hosting tier without a
managed database attached. Storage is not guaranteed to persist across
redeploys — this exists to demonstrate the real auth flow, not as production
infrastructure.

## Endpoints

- `POST /api/auth/register` — `{ username, email, password }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, username }`
- `GET /api/auth/verify` — `Authorization: Bearer <token>` → `{ valid, userId, username, expiresAt }`
- `GET /api/health`
