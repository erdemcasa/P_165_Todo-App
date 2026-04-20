# Backend Usage Guide

Go to `backend` folder:

## Project Setup

```sh
npm install
```

## DB connection

The backend uses a MySQL database. Before starting the Node application, copy the
example environment file and adjust it if needed:

```sh
cp .env.example .env
```

The `.env` file must contain a `DB_URL` variable pointing to your MySQL server:

```sh
DB_URL="mysql://app_user:app_password@localhost:3306/db_todoapp"
```

The default credentials match those defined in the root `.env` used by Docker Compose.

## Run and Hot-Reload for Development

```sh
npm run dev
```

For testing the frontend (e2e:open or e2e:run) a custom route `/test/reset` is necessary to cleanup the DB before each test.

To active such route, start the backend with:

```sh
npm run dev:e2e
```

## Testing Database: Why SQLite?

For automated tests and e2e runs, the backend uses an in-memory SQLite database (see `config/database.js`).

- **Why?** SQLite is fast, requires no setup, and ensures tests run in isolation with a clean DB each time.
- **When migrating to MongoDB:**
  - Use the `mongodb-memory-server` package to achieve the same effect: a temporary, in-memory MongoDB instance for tests.
  - This avoids polluting your real database and makes tests reliable and repeatable.
- See the test DB logic in `config/database.js` for inspiration on how to switch DBs based on `NODE_ENV`.
