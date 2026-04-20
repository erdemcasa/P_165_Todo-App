# Docker Services

To run this application, you need the MySQL service.

As part of this project, you'll need to modify the Node/Express backend to use the MongoDB NoSQL Document database instead of MySQL.

You'll also be implementing a frontend page cache using the Redis key-value NoSQL database.

## Environment Variables

All service credentials are configured via the `.env` file at the project root. Docker Compose loads this file automatically.

To get started, copy the example file and adjust values as needed:

```sh
cp .env.example .env
```

## Starting and Stopping Services

To easily install and start these 3 services under Docker on your PC, run the following command:

```sh
docker compose up -d
```

To stop the services, run the following command:

```sh
docker compose down
```

The 3 services store their respective database data in Docker volumes.

To stop the services and also delete the Docker volumes, run the following command:

```sh
docker compose down -v
```

## Default Credentials

The default credentials are defined in `.env`. See `.env.example` for the full list of variables.

### MySQL

| Variable           | Default        |
| ------------------ | -------------- |
| `DB_ROOT_PASSWORD` | `admin_pwd`        |
| `DB_DATABASE`      | `db_todoapp`   |
| `DB_USER`          | `app_user`     |
| `DB_PASSWORD`      | `app_pwd` |

### MongoDB

| Variable              | Default |
| --------------------- | ------- |
| `MONGO_ROOT_USERNAME` | `admin_user`  |
| `MONGO_ROOT_PASSWORD` | `admin_pwd` |

### Redis

| Variable         | Default |
| ---------------- | ------- |
| `REDIS_PASSWORD`| `admin_pwd` |