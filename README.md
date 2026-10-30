# OM SHIVAM ENTERPRISES ✒️🖨️🎫

> **Stationery • Xerox & Printing • Travel Tickets • School & Office Supplies • All Your Daily Needs in One Place**

A bespoke, high-performance web application designed with modern editorial aesthetics and zero-wait store counter collection. Customers can browse supplies, add items to their bag, and submit their order for 15-minute counter pickup (via WhatsApp or by generating a digital store pickup pass).

---

## 📁 Clean & Professional Architecture

The codebase follows professional frontend engineering standards with modular separation of concerns:

```
om-shivam-enterprises/
├── index.html                    # Root HTML entry with Google Fonts & SEO metadata
├── tailwind.config.js            # Design tokens (warm paper, noir, atelier typography)
├── vite.config.js                # Vite build & dev server configuration
├── package.json                  # Dependencies & scripts
└── src/
    ├── main.jsx                  # React DOM entry
    ├── App.jsx                   # Main application layout & product catalog orchestration
    ├── index.css                 # Global CSS, scrollbar styles, glassmorphism utilities
    ├── constants/
    │   └── store.js              # Single authoritative store config (Phone, Google Maps, Hours, Tagline)
    ├── context/
    │   └── ShopContext.jsx       # State management (Cart, Bag drawer, Quick view, Pickup slip)
    ├── data/
    │   └── products.js           # Curated stationery catalog (20 products with specifications)
    ├── utils/
    │   └── formatters.js         # Formatting helpers (Currency, Order Tokens, WhatsApp order links)
    └── components/
        ├── AnnouncementBar.jsx   # Top announcement ticker with store offerings
        ├── Header.jsx            # Glassmorphism navigation with Google Maps link & bag counter
        ├── ProductCard.jsx       # Luxury gallery card with hover zoom, discount badges, and steppers
        ├── ProductQuickViewModal.jsx # Interactive lightbox with specifications & WhatsApp inquiry
        ├── CartDrawer.jsx        # Slide-over bag with free gift progress & pickup time scheduler
        ├── PickupSlipModal.jsx   # Boutique boarding-pass style pickup slip with Maps directions
        ├── EditorialStory.jsx    # Four store commitments (Stationery, Xerox, Tickets, 15m Pickup)
        └── Footer.jsx            # Dark luxury footer with hours, address, and live Maps navigation
```

---

## 🌟 Key Features

1. **Single Source of Truth ([`src/constants/store.js`](file:///Users/nishandshetty/Documents/Antigravity/Om%20shivam/src/constants/store.js))**:
   - Manage your store name, phone number, Google Maps URL, hours, and addresses in one central place.
2. **Direct Product Grid**:
   - Clean, uncluttered layout starting immediately with the stationery catalog.
3. **Google Maps Integration**:
   - One-click navigation to your store ([`https://maps.app.goo.gl/gBKD1gkP96SNW1VAA`](https://maps.app.goo.gl/gBKD1gkP96SNW1VAA)) accessible via header pill, pickup pass, and footer.
4. **Interactive Atelier Bag**:
   - Complimentary perk tracker (free archival document wallet on orders ₹800+).
   - In-store pickup scheduler with custom time windows.
   - WhatsApp order transmission with formatted order summary and generated pickup token.
5. **Zero Dead Code**:
   - All unused components, dead imports, and redundant styles have been completely audited and removed.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
