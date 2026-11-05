# Online Shop Management System

Storefront + admin dashboard (React, Vite, Tailwind).  
**Note:** `node_modules/` is not in Git — each developer runs `npm install` locally.

## Requirements

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)

## Quick start

```bash
git clone https://github.com/ashikreserveit17/online-shop-management-system.git
cd online-shop-management-system
npm install
npm run dev
```

Open **http://localhost:3000/** in your browser.

## Admin panel

- URL: **http://localhost:3000/?portal=admin**
- Demo login: `admin` / `admin123` (see `src/context/ShopContext.tsx` for other demo accounts)

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Dev server (port 3000)   |
| `npm run build`| Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript check         |

## Optional: Gemini API

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` if you use AI features. The shop runs without it for normal catalog/checkout demos.

## What is in this repo

- All source code (`src/`), assets (`public/`), and config
- `package-lock.json` for consistent installs
- **Not included:** `node_modules/`, `dist/`, `.env` files (see `.gitignore`)
