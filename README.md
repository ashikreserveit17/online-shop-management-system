# Online Shop Management System

Storefront + admin dashboard (React, Vite, Tailwind).  
**Note:** `node_modules/` is not in Git — each developer runs `npm install` locally.

## Requirements

- **[Node.js 20 or 22 LTS](https://nodejs.org/)** (recommended). Node 24+ may work but is not tested; use LTS if `npm install` fails on esbuild.
- npm 10+ (comes with Node)

## Quick start

```bash
git clone https://github.com/ashikreserveit17/online-shop-management-system.git
cd online-shop-management-system
npm install
npm run dev
```

Open **http://localhost:3000/** in your browser.

## Troubleshooting `npm install` (especially on Windows)

This is **not a missing file in GitHub**. `node_modules` is created on your PC when you run `npm install`. Failures are usually local locks or permissions.

| Message | Meaning |
|--------|---------|
| `deprecated node-domexception` | Harmless warning from a dependency — **ignore it**. |
| `EPERM` / `EBUSY` on `esbuild.exe` or `@tailwindcss` | Another program is **using or blocking** files in `node_modules` (very common on Windows). |

**Fix (Windows):**

1. Stop **`npm run dev`**, close extra terminals, and close the project in Cursor/VS Code if needed.
2. Delete the broken folder (PowerShell, in project root):

   ```powershell
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
   ```

3. Use **Node 20 or 22 LTS** (`node -v`). If you see v24, install LTS from [nodejs.org](https://nodejs.org/).
4. Run install again:

   ```powershell
   npm install
   ```

5. If it still fails: temporarily **pause Windows Defender** real-time scan for the project folder, or add an exclusion for the project path; then repeat steps 2–4.

**Fix (Mac/Linux):**

```bash
rm -rf node_modules
npm install
```

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
