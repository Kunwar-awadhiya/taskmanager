📝 Task Manager
A modern task management web application built with Next.js, Prisma, MongoDB, and Clerk for authentication. This app allows users to manage their tasks securely and efficiently with a sleek, modern interface.

🚀 Tech Stack
Frontend & Backend: Next.js

Database ORM: Prisma

Database: MongoDB

Authentication: Clerk

Package Manager: npm

🛠️ Getting Started
Prerequisites
Make sure you have the following installed:

Node.js 

MongoDB Atlas or a local MongoDB instance

Clerk account for authentication setup

📦 Installation
Clone the repository and install dependencies:

bash
Copy
Edit
npm install
🔐 Environment Variables
You’ll need to set up two environment files:

1. .env.local
Create a .env.local file in the root of your project and add the following:

env
Copy
Edit
DATABASE_URL="your_mongodb_connection_string"
CLERK_SECRET_KEY="your_clerk_secret_key"
CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
2. .env
This can be used for global project configuration if needed (optional, based on your use case).

🧑‍💻 Run the Development Server
bash
Copy
Edit
npm run dev
Visit http://localhost:3000 to view the app in your browser.

📁 Project Structure
bash
Copy
Edit
/pages         → Next.js pages and routes
/components    → Reusable UI components
/lib           → Utility functions, API clients
/prisma        → Prisma schema and migrations
🧪 Prisma Setup
After configuring your DATABASE_URL, run the following commands to generate and push the Prisma schema:

bash
Copy
Edit
npx prisma generate
npx prisma db push
✅ Features
User authentication via Clerk

Create, read, update, delete (CRUD) tasks

Responsive UI

MongoDB-backed persistence

Secure session handling