# 🐾 petPlace - Premium Pet Supplies E-Commerce

**Live Preview:** [petPlace Web App](https://petplace-client.vercel.app/)

**petPlace** is a modern, full-stack e-commerce platform dedicated to pet lovers. It provides a seamless shopping experience for pet supplies, featuring secure user authentication, advanced cart management, and dynamic product exploring categorized by pet types (Dogs, Cats, Birds, Turtles, etc.).

---

## 🔗 Repository Links
- **Frontend (Client):** [petPlace-client](https://github.com/Shanto93/petPlace/tree/main/petplace-client)
- **Backend (Server):** [petPlace-server](https://github.com/Shanto93/petPlace/tree/main/petPlace-server)

---

## ✨ Key Features

- **🛍️ Dynamic Product Exploring:** Filter products by pet category, search terms, and price ranges.
- **🔐 Secure Authentication:** Powered by NextAuth on the frontend and custom JWT + HTTP-Only cookies on the Express backend.
- **🛒 Robust Cart Management:** Relational database design ensuring users only see their specific cart items, with dynamic quantity updates and auto-cleanup.
- **🖼️ Advanced Image Handling:** Multi-image uploads directly to Cloudinary using memory storage streams (optimized for cloud deployments like Render).
- **🛡️ Role-Based Access Control:** Distinct profiles for `Admin` and `AuthenticatedUser` linked via a secure UUID system.
- **⚡ Interactive UI:** Built with Next.js, featuring Framer Motion animations and responsive layouts.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** Sonner

### Backend
- **Framework:** Node.js with Express.js
- **Database ORM:** Prisma
- **Validation:** Zod
- **Image Hosting:** Cloudinary (via Multer memory storage)
- **Security:** bcryptjs, jsonwebtoken (JWT)
- **Language:** TypeScript

---

## 🧠 Technical Highlights & Architecture

During the development of this project, several advanced technical implementations were achieved:

1. **NextAuth & Custom Backend Bridge:** Successfully bridged Next.js frontend sessions with an independent Express API. Reconstructed NextAuth session callbacks to securely pass the database `UUID` and `accessToken` to the client for authorized API calls.
2. **Cloud-Optimized File Uploads:** Bypassed traditional disk-storage limits on cloud hosts (like Render/Vercel) by implementing `multer.memoryStorage()`, streaming file buffers directly into Cloudinary.
3. **Strict Prisma Relational Integrity:** Resolved complex database validation constraints by strictly mapping Integer-based Auth accounts to UUID-based User Profiles, ensuring the Cart and Order schemas maintain perfect relational harmony.
4. **Dynamic Array Overwrites:** Built a bulletproof image update controller that safely merges, adds, and removes arrays of Cloudinary URLs in the database without silent failures.

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/Shanto93/petPlace.git](https://github.com/Shanto93/petPlace.git)
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd petPlace-server
npm install
```

Create a `.env` file in the server root and add the following variables:
```bash
NODE_ENV="development"
PORT=5000
DATABASE_URL="your_prisma_database_url"
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_ACCESS_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="90d"

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Push the Prisma schema to your database and start the server:
```bash
npx prisma db push
npm run dev
```

### 2. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd petplace-client
npm install
```

Create a `.env` file in the client root:
```bash
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

Start the Next.js development server:
```bash
npm run dev
```
The application will now be running on http://localhost:3000.
## 📄 API Endpoints Overview

- **Auth:** `POST /api/v1/auth/login`, `POST /api/v1/auth/register`
- **Items:** `GET /api/v1/item`, `POST /api/v1/item`, `PATCH /api/v1/item/:id`, `DELETE /api/v1/item/:id`
- **Cart:** `GET /api/v1/cart/user/:userId`, `POST /api/v1/cart`, `PATCH /api/v1/cart/:id`, `DELETE /api/v1/cart/:id`

*(Note: Protected routes require a valid Bearer Token in the Authorization header).*

---

## 👨‍💻 Author

**Shanto**
- GitHub: [@Shanto93](https://github.com/Shanto93)
