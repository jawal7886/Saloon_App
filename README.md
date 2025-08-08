# Saloon_App (Laravel + React)

A modern barbershop/salon web application built with Laravel (API) and React/TypeScript (frontend). It includes an admin panel for managing barbers, services, offers, and a media gallery, plus a public site to showcase categories and images.

## Features

- Admin panel (React) for:
  - Barber management (create, update, activate/deactivate, delete)
  - Services and offers CRUD
  - Gallery management with image upload (multipart) and sorting
  - Category management
- Public site (React) for:
  - Viewing gallery images by category (All, Haircuts, Beard, Interior, Team, Transformations)
  - Lightbox image preview
- RESTful JSON APIs (Laravel)
- File uploads stored under `storage/app/public/gallery` and served via `/storage/...`

## Tech Stack

- Backend: Laravel 10+, PHP 8.x, MySQL
- Frontend: React + TypeScript, Axios, TailwindCSS
- Dev: Vite, Node 18+

## Getting Started

### Prerequisites
- PHP 8.x (with extensions required by Laravel)
- Composer
- Node.js 18+
- MySQL
- (Optional) XAMPP on Windows

### 1) Clone & install dependencies

```bash
# From your web root (e.g. C:\xampp\htdocs)
git clone <your-repo-url> barbershop
cd barbershop

# PHP deps
composer install

# Node deps
npm install
```

### 2) Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` to point to your MySQL database:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=barbershop
DB_USERNAME=root
DB_PASSWORD=
```

### 3) Migrate database

```bash
php artisan migrate
```

If you re-run frequently during development, you can reset:

```bash
php artisan migrate:fresh
```

### 4) Storage symlink (for serving uploaded images)

```bash
php artisan storage:link
```

### 5) Run the app (two terminals)

```bash
# Terminal A (Laravel API)
php artisan serve --host=127.0.0.1 --port=8000

# Terminal B (Vite dev server)
npm run dev
```

Visit:
- API base: `http://127.0.0.1:8000`
- Frontend (Vite): `http://127.0.0.1:5173` (or your configured port)

For production build:

```bash
npm run build
```

## Key Directories

- `app/Http/Controllers/` — API controllers (e.g., `GalleryController.php`, `BarberController.php`)
- `app/Models/` — Eloquent models (e.g., `Gallery.php`, `Barber.php`, `Category.php`)
- `resources/js/components/` — React components (Admin, public `gallery.tsx`)
- `database/migrations/` — Schema (gallery, barbers, categories, etc.)

## API Overview (Gallery)

Base path: `/api`

- `GET /api/gallery` — List all gallery items
- `GET /api/gallery/active` — List active items only
- `GET /api/gallery/category/{category}` — List active items by category
- `GET /api/gallery/{id}` — Show single item
- `POST /api/gallery` — Create item (multipart/form-data)
  - Fields: `image` (file, required), `category` (string), `title`, `description`, `is_active` (true/false), `sort_order` (int)
- `POST /api/gallery/{id}` + `_method=PUT` — Update item (multipart or JSON)
  - Fields: `image` (file, optional), `category`, `title`, `description`, `is_active` (true/false), `sort_order` (int)
- `PUT /api/gallery/{id}/toggle-status` — Toggle active state
- `PUT /api/gallery/reorder` — Bulk reorder
  - Body: `{ items: [{ id: number, sort_order: number }, ...] }`
- `DELETE /api/gallery/{id}` — Delete item

Responses typically follow:

```json
{ "success": true, "data": { /* ... */ }, "message": "..." }
```

Public site uses:
- `GET /api/categories` for chip labels (names)
- `GET /api/gallery/active` and `GET /api/gallery/category/{category}` for display

## Admin Frontend Notes

- File uploads: do NOT set `Content-Type` manually for multipart; let Axios set the boundary.
- For updates with file upload, POST FormData with `_method=PUT` to ensure Laravel parses fields correctly.
- Ensure your layout includes the CSRF meta tag so Axios can send the token:

```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

## Troubleshooting

- Images not visible:
  - Run `php artisan storage:link`
  - Check that DB `image_path` contains a path under `gallery/...`
  - Public URL should be `/storage/<image_path>`
- Validation says "The category field is required" on update:
  - Make sure FormData includes `category` and you are using POST + `_method=PUT` for updates
- 422 for `is_active`:
  - Frontend sends strings; backend accepts `true/false/0/1` and casts with `FILTER_VALIDATE_BOOLEAN`
- Windows PowerShell issues with long commands:
  - Use shorter commands or run in Git Bash/WSL

## Scripts

```bash
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
```

## License

MIT (or your chosen license). Update this section accordingly.
