# OM SHIVAM ENTERPRISES ✒️🖨️🎫

> **Stationery • Xerox & Printing • Travel Tickets • School & Office Supplies • All Your Daily Needs in One Place**

A full-stack, modular architecture separated into **`frontend/`** and **`backend/`** services for OM SHIVAM ENTERPRISES, featuring an Awwwards-inspired luxury stationery interface, digital store pickup slips, and an Express REST API backend.

---

## 📁 Repository Architecture

```
om-shivam-enterprises/
├── package.json                  # Root monorepo configuration (npm workspaces)
├── vercel.json                   # Vercel deployment configuration
├── .gitignore                    # Root gitignore for frontend & backend
├── README.md                     # Project documentation
│
├── frontend/                     # 🌐 Client Application (React + Vite + Tailwind)
│   ├── index.html                # HTML entry with Google Fonts
│   ├── package.json              # Frontend dependencies (React, Lucide, Tailwind, Confetti)
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Design tokens (warm paper, noir, atelier typography)
│   ├── postcss.config.js         # PostCSS plugins
│   └── src/
│       ├── main.jsx              # Application entrypoint
│       ├── App.jsx               # Root view & catalog orchestration
│       ├── index.css             # Design tokens & glassmorphism styling
│       ├── constants/
│       │   └── store.js          # Authoritative store metadata & hours
│       ├── utils/
│       │   └── formatters.js     # Currency & WhatsApp order generators
│       ├── context/
│       │   └── ShopContext.jsx   # State management
│       ├── data/
│       │   └── products.js       # Curated 20-product catalog
│       └── components/
│           ├── AnnouncementBar.jsx # Continuous top announcement ribbon
│           ├── Header.jsx        # Glassmorphism navbar with Google Maps link
│           ├── ProductCard.jsx   # Gallery card with smooth hover scale
│           ├── ProductQuickViewModal.jsx # Product lightbox & specifications
│           ├── CartDrawer.jsx    # Slide-over bag & pickup scheduler
│           ├── PickupSlipModal.jsx # Boarding-pass voucher with Maps directions
│           ├── EditorialStory.jsx # 4 store pillars (Stationery, Xerox, Tickets, 15m Pickup)
│           └── Footer.jsx        # Dark luxury footer
│
└── backend/                      # ⚙️ Server Application (Node.js + Express)
    ├── package.json              # Express, CORS, Dotenv
    ├── server.js                 # REST API endpoints (/api/health, /api/store, /api/orders)
    └── .env.example              # Environment variables template (PORT=5001)
```

---

## 🚀 Running Locally

### 1. Run Frontend (Client App)
```bash
npm run dev
# Or from root: npm run dev:frontend
```
The client runs at `http://localhost:3000/`.

### 2. Run Backend (REST API)
```bash
npm run dev:backend
# Or cd backend && npm run dev
```
The API runs at `http://localhost:5001/` with endpoints:
- `GET /api/health` — Service health check
- `GET /api/store` — Store address, contact, and hours
- `POST /api/orders` — In-store order creation and token allocation
- `GET /api/orders/:token` — Order lookup by token

### 3. Build for Production (Vercel Ready)
```bash
npm run build
```
Vercel automatically detects `frontend/dist` as configured in [`vercel.json`](./vercel.json).
