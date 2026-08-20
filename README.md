# PaperHaven (SmartBook) 📚

**PaperHaven** is a modern, full-stack e-commerce bookstore web application designed for discovering, purchasing, and managing books online. Built with a React + Vite frontend and a Node.js/Express + MongoDB backend, it offers a seamless shopping experience for book lovers and a management suite for store administrators.

---

## 🚀 Features

### 🛒 Customer Features
- **Book Catalog & Discovery**: Browse, search, and filter a vast collection of books with detailed descriptions and pricing.
- **Shopping Cart**: Real-time state management using Redux Toolkit for adding, updating, and removing items.
- **Wishlist**: Save favorite titles for future reading and easy access.
- **Buy Now & Checkout**: Streamlined checkout workflow supporting direct instant purchases and cart checkout.
- **Order Management & Tracking**: View order history, track order statuses, and receive confirmation alerts.
- **User Authentication**: Secure user sign-up, login, Google OAuth integration, and JWT-based session state.
- **User Profile**: Personal dashboard to manage account details and order history.

### 🛡️ Admin Features
- **Admin Dashboard**: Manage inventory, add new books, edit details, and remove listings.
- **Role-Based Access Control**: Protected routes ensuring administrative features are strictly gated.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + React-Redux
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Auth & API**: Google OAuth (`@react-oauth/google`), Axios, `jwt-decode`

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js v5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Caching**: [Redis](https://redis.io/)
- **Security & Auth**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`

---

## 📂 Project Structure

```text
PaperHaven/
├── BackEnd/
│   ├── Config/          # Database and Redis configurations
│   ├── Controller/      # Route controllers (Users, Products, Orders)
│   ├── Middleware/      # Auth and authorization middlewares
│   ├── Model/           # Mongoose schemas (User, Product, Order)
│   ├── Routes/          # API endpoints (User, Product, Order routes)
│   ├── server.js        # Server entry point
│   └── package.json
├── Frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── api/         # API integration layer
│   │   ├── app/         # Redux store configuration
│   │   ├── components/  # Reusable UI components & pages (Cart, Wishlist, BuyNow, etc.)
│   │   ├── features/    # Redux slices (cart, product, user state)
│   │   ├── App.jsx      # Main application router
│   │   └── main.jsx     # Frontend entry point
│   └── package.json
├── package.json         # Monorepo / root scripts
└── vercel.json          # Deployment configuration
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) database instance (local or MongoDB Atlas)
- [Redis](https://redis.io/) instance (optional/local)

---

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PaperHaven
   ```

2. **Setup Backend**
   ```bash
   cd BackEnd
   npm install
   ```
   Create a `.env` file in the `BackEnd` directory with the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   REDIS_URL=your_redis_connection_url
   ```
   Start the backend server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```
   Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```
   Start the development server:
   ```bash
   npm run dev
   ```

4. **Open Application**
   Navigate to `http://localhost:5173` (or the port displayed by Vite) in your browser.

---

## 📜 Scripts

### Root Directory
- `npm run build`: Triggers the production build for the Frontend application.

### Backend (`/BackEnd`)
- `npm run dev`: Runs the backend with `nodemon` for auto-reloading during development.
- `npm start`: Runs the server with Node.js.

### Frontend (`/Frontend`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles production assets.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint checks.

---

## 🌐 Deployment Options

### ⚡ Option 1: Split Hosting (Recommended Best Practice)
For a MERN stack application with long-running Node/Express and Redis connections:

1. **Frontend (React + Vite) ➔ Vercel / Netlify**
   - Connect your GitHub repository to [Vercel](https://vercel.com).
   - Set **Root Directory** to `Frontend`.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Set Environment Variables:
     - `VITE_API_BASE_URL`: Your deployed backend URL (e.g., `https://paperhaven-api.onrender.com`)
     - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID

2. **Backend (Express + Node.js) ➔ Render / Railway**
   - Deploy the `BackEnd` directory as a Web Service on [Render](https://render.com) or [Railway](https://railway.app).
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Set Environment Variables:
     - `PORT`: `3000` (or dynamically assigned)
     - `MONGO_URI`: MongoDB Atlas connection string
     - `JWT_SECRET`: Secure JWT secret key
     - `REDIS_URL`: Managed Redis URL (e.g., Upstash Redis)

3. **Database & Cache**
   - **MongoDB**: Host on [MongoDB Atlas](https://www.mongodb.com/atlas) (Free Tier available).
   - **Redis**: Host on [Upstash Redis](https://upstash.com/) (Serverless Redis Free Tier).

---

### 🐳 Option 2: Docker Containerization
Deploy as unified containers on cloud providers (AWS EC2, DigitalOcean Droplet, Linode, or Hetzner):
- Spin up containerized instances for `Frontend`, `BackEnd`, `MongoDB`, and `Redis` using `docker-compose`.

