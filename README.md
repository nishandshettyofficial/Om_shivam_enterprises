# OM SHIVAM ENTERPRISES ✒️🖨️🎫

> **Stationery • Xerox & Printing • Travel Tickets • School & Office Supplies • All Your Daily Needs in One Place**

A full-stack, modular architecture separated into **`frontend/`** and **`backend/`** services for OM SHIVAM ENTERPRISES, featuring an intuitive high-performance stationery & print services interface, instant order pickups, digital vouchers, customer & shopkeeper dashboards, and an Express REST API backend.

---

## 📁 Repository Architecture

```
om-shivam-enterprises/
├── package.json                  # Root monorepo configuration (npm workspaces)
├── vercel.json                   # Vercel deployment configuration
├── .gitignore                    # Root gitignore for frontend & backend
├── README.md                     # Project documentation
├── scripts/
│   └── dev.mjs                   # Unified concurrent dev server runner (backend + frontend)
│
├── frontend/                     # 🌐 Client Application (React 18 + Vite 6 + Tailwind CSS)
│   ├── index.html                # HTML entry with Plus Jakarta Sans typography
│   ├── package.json              # Frontend dependencies (React, Lucide, Tailwind, Confetti)
│   ├── vite.config.js            # Vite configuration with Lucide import optimization
│   ├── tailwind.config.js        # Design tokens (warm paper, noir, atelier typography)
│   ├── postcss.config.js         # PostCSS plugins
│   ├── .env.example              # Frontend environment variables template
│   └── src/
│       ├── main.jsx              # Application entrypoint & OAuth provider wrapping
│       ├── App.jsx               # Root view orchestration & client view switching
│       ├── index.css             # Design tokens & glassmorphism styling
│       ├── constants/
│       │   └── store.js          # Authoritative store metadata & operating hours
│       ├── utils/
│       │   └── formatters.js     # Currency & WhatsApp order generators
│       ├── context/
│       │   ├── ShopContext.jsx   # Catalog, cart & order state management
│       │   └── AuthContext.jsx   # Multi-auth session (Mobile, Password/PIN, Google OAuth)
│       ├── data/
│       │   └── products.js       # Curated multi-category product catalog & smart search
│       └── components/
│           ├── AnnouncementBar.jsx       # Continuous top announcement ribbon
│           ├── Header.jsx                # Responsive navbar with search & quick actions
│           ├── Sidebar.jsx               # Collapsible navigation & category filtering
│           ├── ToolHubHero.jsx           # Interactive store services hero
│           ├── PrintStudio.jsx           # Document printing price estimator & order builder
│           ├── PrintUploadModal.jsx      # File upload & printing preferences dialog
│           ├── ProductCard.jsx           # Product display card with stock indicators
│           ├── ProductQuickViewModal.jsx # Product detail lightbox & specifications
│           ├── CartDrawer.jsx            # Slide-over bag & pickup scheduler
│           ├── PickupSlipModal.jsx       # Boarding-pass digital pickup voucher
│           ├── SignInPage.jsx            # Fullscreen authentication page
│           ├── UserDashboard.jsx         # Customer order tracking & profile management
│           ├── ShopkeeperDashboard.jsx   # Store owner order management portal
│           ├── ShaderButton.jsx          # Interactive animated button component
│           └── Footer.jsx                # Store contact, hours & legal footer
│
└── backend/                      # ⚙️ Server Application (Node.js + Express)
    ├── package.json              # Express, CORS, Dotenv
    ├── server.js                 # REST API endpoints (Auth, Store, Orders, Print, Travel)
    └── .env.example              # Environment variables template (PORT=5001)
```

---

## 🚀 Running Locally

### 1. Unified Run (Frontend + Backend Concurrently)
```bash
npm run dev
```
Starts both the Express REST API (`http://localhost:5001`) and the Vite client (`http://localhost:3000`) simultaneously.

### 2. Run Individually

- **Backend only:**
  ```bash
  npm run dev:backend
  ```
  Runs on `http://localhost:5001/` with endpoints:
  - `GET /api/health` — Service health check
  - `GET /api/store` — Store address, contact, and hours
  - `POST /api/auth/register` — Instant customer registration
  - `POST /api/auth/login` — Authentication via Mobile / Email / PIN / Password
  - `POST /api/orders` — In-store order creation and token allocation
  - `GET /api/orders/:token` — Order lookup by token
  - `POST /api/print-jobs` — Print order submission
  - `POST /api/travel-requests` — Rail/Flight travel booking requests

- **Frontend only:**
  ```bash
  npm run dev:frontend
  ```
  Runs on `http://localhost:3000/` with proxying to backend on port 5001.

### 3. Production Build
```bash
npm run build
```
Builds the client into `frontend/dist/` optimized for Vercel or any static host.
