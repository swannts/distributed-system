# Docker environments

Copy `.env.example` to `.env` and set `INVENTORY_APP_KEY` before starting.

Development, with Laravel `php artisan serve` and Nest watch mode:

```bash
docker compose up --build
```

This Compose file is currently development-only. MySQL and Redis stay on the
private Compose network while the application ports are published.
