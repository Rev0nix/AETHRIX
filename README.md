# AETHRIX

A premium, multi-category e-commerce platform — **Electronics, Fashion, Smart Gadgets, Home Decor, Fitness & Accessories** — built as three separate apps in one repo:

```
aethrix/
├── frontend/   React + Vite storefront (customer-facing)
├── backend/    Node.js + Express + MongoDB API
└── admin/      React + Vite admin dashboard
```

## ✨ Features

**Storefront**
- Hero, infinite marquee, trusted-brands strip, featured products, categories
- Flash sale section with live countdown timer
- Live animated stats counters
- Testimonials slider, video banner, newsletter signup
- Smart search with instant suggestions
- Full shop with category/price filters + sorting + pagination
- Product detail page: gallery, sizes, quantity, reviews, related products
- Cart + wishlist (persisted to localStorage, synced to account when logged in)
- Checkout with **Razorpay** (UPI/cards/wallets) or Cash on Delivery
- Coupon codes
- Order tracking page (Confirmed → Packed → Shipped → Out for Delivery → Delivered)
- Floating **Nova** AI chat widget (rule-based UI shell — wire to your own LLM backend to make it "real")
- JWT auth (register/login/profile/addresses), protected routes
- Dark/blue glassmorphism theme, fully responsive

**Admin Dashboard** (separate app, port 5174)
- Login (admin-role only)
- Dashboard with revenue/orders/customers stats + 7-day revenue chart
- Product CRUD
- Order management + status updates (drives the customer-facing tracker)
- Customer management (enable/disable accounts)
- Coupon CRUD
- Analytics page

**Backend API**
- REST API: auth, products, orders, users, reviews, coupons
- MongoDB + Mongoose models: User, Product, Order, Review, Coupon
- JWT authentication, bcrypt password hashing
- Razorpay order creation + payment signature verification
- Cloudinary product image uploads
- Order confirmation emails (Nodemailer)
- Seed script with sample data across all 6 categories

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Framer Motion, Axios, React Icons |
| Admin | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs |
| Payments | Razorpay |
| Images | Cloudinary |
| Email | Nodemailer |

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster
- A free [Razorpay test account](https://dashboard.razorpay.com/signup) (for checkout)
- A free [Cloudinary account](https://cloudinary.com/users/register/free) (for product image uploads — optional to start)

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/aethrix.git
cd aethrix
npm run install:all
```

This installs dependencies in `backend/`, `frontend/`, and `admin/`.

> If `npm run install:all` isn't available yet (first clone), just run it from the root — the root `package.json` is already in the repo.

### 2. Configure environment variables

**Backend** — copy the example and fill in your values:
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/aethrix
JWT_SECRET=replace_this_with_a_long_random_secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**Frontend** — copy the example (defaults work for local dev via the Vite proxy):
```bash
cp frontend/.env.example frontend/.env
```

### 3. Seed the database

```bash
npm run seed
```
This creates:
- An **admin** user: `admin@aethrix.in` / `admin12345`
- A **customer** user: `customer@aethrix.in` / `customer123`
- 18 sample products across all 6 categories
- 3 sample coupons: `AETHRIX10`, `WELCOME20`, `FLAT500`

To wipe the seeded data later: `npm run seed --prefix backend -- -d`

### 4. Run everything

```bash
npm run dev
```

This starts all three apps concurrently:
| App | URL |
|---|---|
| Storefront | http://localhost:5173 |
| Admin Dashboard | http://localhost:5174 |
| API | http://localhost:5000 |

Or run them individually in separate terminals:
```bash
npm run dev:backend
npm run dev:frontend
npm run dev:admin
```

Log into the admin panel at `http://localhost:5174/login` with the seeded admin credentials.

---

## 📤 Push This Project to GitHub

If you downloaded this project as files (not yet a git repo), here's the full flow:

### Option A — Create the repo on GitHub first (recommended)

1. Go to [github.com/new](https://github.com/new), create a new **empty** repository (don't initialize with a README, .gitignore, or license — we already have one).
2. Copy the repo URL it gives you, e.g. `https://github.com/<your-username>/aethrix.git`
3. In your terminal, from the `aethrix/` project root:

```bash
git init
git add .
git commit -m "Initial commit: AETHRIX multi-category e-commerce platform"
git branch -M main
git remote add origin https://github.com/<your-username>/aethrix.git
git push -u origin main
```

That's it — refresh the GitHub page and your code will be there.

### Option B — Using GitHub CLI

```bash
gh repo create aethrix --private --source=. --remote=origin
git add .
git commit -m "Initial commit: AETHRIX multi-category e-commerce platform"
git push -u origin main
```

### ⚠️ Before you push — double check secrets are excluded

This repo's `.gitignore` already excludes `.env` files and `node_modules/`. Confirm before pushing:

```bash
git status
```

You should **not** see `backend/.env`, `frontend/.env`, or any `node_modules` folders listed. Only `.env.example` files should be tracked. If a real `.env` ever gets committed by accident, rotate those secrets (JWT secret, Razorpay keys, Cloudinary keys, email password) immediately — don't just delete the file from a later commit, since it stays in git history.

### Cloning it back down later (on another machine)

```bash
git clone https://github.com/<your-username>/aethrix.git
cd aethrix
npm run install:all
cp backend/.env.example backend/.env   # then fill in real values
cp frontend/.env.example frontend/.env
npm run seed
npm run dev
```

---

## 🌐 Deployment Notes

- **Backend**: deploy to Render, Railway, or Fly.io. Set all env vars from `backend/.env.example` in your host's dashboard. Point `MONGO_URI` to an Atlas cluster (not localhost).
- **Frontend & Admin**: deploy to Vercel or Netlify as two separate static sites (or one monorepo with two projects). Set `VITE_API_URL` to your deployed backend URL, and update `CLIENT_URL` / `ADMIN_URL` in the backend `.env` to match your deployed frontend/admin URLs (for CORS).
- **Razorpay**: switch from test keys (`rzp_test_...`) to live keys (`rzp_live_...`) only after testing the full checkout flow.
- **Images**: product images uploaded via the admin panel go to Cloudinary — make sure your Cloudinary env vars are set on the backend host.

---

## 📁 Folder Reference

```
aethrix/
├── frontend/src/
│   ├── components/      # Navbar, Hero, ProductCard, NovaChat, FlashSale, etc.
│   ├── pages/            # Home, Shop, Product, Cart, Checkout, Profile, etc.
│   ├── context/           # AuthContext, CartContext, WishlistContext
│   ├── hooks/             # useAuth, useCart, useWishlist, useCountdown
│   ├── services/          # api.js, authService, productService, orderService
│   ├── layouts/           # MainLayout, ProtectedRoute
│   └── data/              # staticContent.js (categories, testimonials, etc.)
│
├── backend/
│   ├── models/            # User, Product, Order, Review, Coupon
│   ├── controllers/       # business logic
│   ├── routes/            # REST endpoints
│   ├── middleware/        # auth, admin, error handling, file upload
│   └── utils/              # generateToken, sendEmail, seeder
│
└── admin/src/
    ├── pages/              # Dashboard, Products, Orders, Customers, Coupons, Analytics
    └── components/         # Sidebar, Topbar, StatCard, ProductTable
```

---

## 🔑 Default Seeded Logins

| Role | Email | Password |
|---|---|---|
| Admin | admin@aethrix.in | admin12345 |
| Customer | customer@aethrix.in | customer123 |

**Change these before deploying to production.**
