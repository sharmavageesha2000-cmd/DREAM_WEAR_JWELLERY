# ✨ DREAM WEAR — Luxury Anti-Tarnish Fine Jewelry E-Commerce

A full-stack, responsive luxury fine jewelry e-commerce platform built with **React**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express**, and **PostgreSQL**.

---

## 🌟 Highlights & Key Features

- **Anti-Tarnish & Waterproof Guarantee**: Built-in 2-year color warranty and live interactive material demonstrations.
- **Cinematic Visuals & Animations**: Scroll-triggered slow zoom-out effects, dynamic try-on stages, and unboxing reveals.
- **Complete Atelier Catalog**: 42 handcrafted fine jewelry items across 8 categories (Necklaces, Earrings, Rings, Bracelets, Sets, Anklets, Nose Pins, Toe Rings).
- **Interactive Multi-Angle Gallery**: 4 distinct angles per piece (Studio, Macro, 45° Contour, Editorial) with magnifier zoom.
- **Live Cart & Wishlist**: Real-time bag totals, free shipping progress, gift wrapping options, and promo vouchers (`WELCOME10`, `AURELIA200`, `SPARKLE`).
- **Complete Checkout & Tracking**: Postal PIN verification, payment options (UPI, Card, Netbanking, COD), order summary, and live courier tracking codes.
- **Customer Account Portal**: Saved delivery address book, order fulfillment history, and profile management.
- **Executive Admin Atelier Hub**: Live sales revenue analytics, inventory low-stock alerts, customer database, and dynamic product management.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Luxury Tokens & Keyframe Animations
- **Icons**: Lucide React
- **Confetti**: Canvas Confetti
- **Routing**: React Router DOM v6

### Backend & Database
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL (with connection pooling & SSL support)
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt Password Hashing
- **Security & Middleware**: CORS, Dotenv, Request Logging

---

## 📁 Project Architecture

```
├── db/
│   └── schema.sql                # Complete PostgreSQL relational database schema
├── server/
│   ├── src/
│   │   ├── config/db.js          # PostgreSQL connection pool & auto-migration
│   │   ├── middleware/auth.js    # JWT authentication middleware
│   │   ├── routes/               # Express REST API routes
│   │   │   ├── products.js       # Products CRUD, filters, search & pagination
│   │   │   ├── categories.js     # Categories with dynamic product count
│   │   │   ├── auth.js           # Register, login, profile & address book
│   │   │   ├── orders.js         # Order placement, tracking & status updates
│   │   │   ├── reviews.js        # Verified customer reviews & likes
│   │   │   ├── coupons.js        # Promo code validation & vouchers
│   │   │   ├── shipping.js       # Postal code delivery estimation
│   │   │   └── admin.js          # Admin atelier revenue & live metrics
│   │   ├── data/seedData.js      # Seed catalog data (42 pieces + 8 categories)
│   │   └── seed.js               # Database seeder script
│   ├── package.json              # Server dependencies
│   └── index.js                  # Main Express server entry point
├── src/
│   ├── components/               # Modular UI components (Home, Layout, Product, UI)
│   ├── context/                  # AuthContext, CartContext, WishlistContext, ToastContext
│   ├── data/                     # Local fallback catalog, categories & reviews
│   ├── pages/                    # Home, Shop, ProductDetail, Cart, Checkout, Account, Admin
│   ├── services/                 # api.ts (Live REST client with resilient fallback)
│   ├── types/                    # TypeScript interfaces & domain types
│   ├── App.tsx                   # Main React routing
│   └── main.tsx                  # Application entry
├── public/                       # Static imagery, categories & product assets
├── .env.example                  # Environment configuration template
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (Local or Cloud like Neon)

### 2. Clone the Repository
```bash
git clone https://github.com/sharmavageesha2000-cmd/DREAM_WEAR_JWELLERY.git
cd DREAM_WEAR_JWELLERY
```

### 3. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 4. Configure Environment
Copy `.env.example` to `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_ENABLE_MOCK_API=false
```

In `server/.env`:
```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_PASSWORD=vageesha@2026
```

### 5. Seed the Database
```bash
npm run seed
```

### 6. Run the Application
```bash
# In terminal 1: Run Backend API Server
npm run server

# In terminal 2: Run Frontend Development Server
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api/v1`
- **API Health Check**: `http://localhost:5000/api/v1/health`

---

## 💎 Admin Portal
- Navigate to `/admin/login`
- Master Access Passcode: `vageesha@2026`
- Features: Order fulfillment hub, catalog management, inventory control, and live revenue analytics.

---

## 📄 License
Private repository © DREAM WEAR Fine Jewelry. All rights reserved.
