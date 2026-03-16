# TaskFlow - Modern Task Management System

TaskFlow is a high-performance, full-stack task management application built with **Next.js 15**, **Express.js**, and **Prisma**. It offers a seamless experience for managing tasks with a focus on speed, security, and a premium user interface.

## 🚀 Key Features

-   **Secure Authentication**: JWT-based authentication with access and refresh tokens.
-   **Task Management**: Comprehensive CRUD operations (Create, Read, Update, Delete) for tasks.
-   **Intelligent Filtering**: Filter tasks by status (To Do, In Progress, Completed).
-   **Modern UI/UX**: Built with Tailwind CSS, Framer Motion for smooth animations, and Shadcn UI components.
-   **Robust Backend**: Type-safe API with Zod validation and structured logging using Winston.
-   **Database**: Powered by PostgreSQL and managed through Prisma ORM.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Components**: [Shadcn UI](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
-   **Icons**: [Lucide React](https://lucide.dev/)

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL)
-   **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
-   **Validation**: [Zod](https://zod.dev/)
-   **Logging**: [Winston](https://github.com/winstonjs/winston)

## 📁 Project Structure

```text
Directory structure:
└── kartik7310-taskflow/
    ├── README.md
    ├── backend/
    │   ├── package.json
    │   ├── prisma.config.ts
    │   ├── tsconfig.json
    │   ├── prisma/
    │   │   ├── schema.prisma
    │   │   └── migrations/
    │   │       ├── migration_lock.toml
    │   │       └── 20260315134209_added_modals/
    │   │           └── migration.sql
    │   └── src/
    │       ├── index.ts
    │       ├── config/
    │       │   ├── db.ts
    │       │   ├── env.ts
    │       │   └── logger.ts
    │       ├── controllers/
    │       │   ├── auth.controller.ts
    │       │   └── task.controller.ts
    │       ├── middlewares/
    │       │   ├── auth.middleware.ts
    │       │   ├── error.middleware.ts
    │       │   └── validate.middleware.ts
    │       ├── routes/
    │       │   ├── auth.routes.ts
    │       │   └── task.routes.ts
    │       ├── schemas/
    │       │   ├── auth.schema.ts
    │       │   └── task.schema.ts
    │       ├── services/
    │       │   ├── auth.service.ts
    │       │   └── task.service.ts
    │       └── utils/
    │           ├── api-error.ts
    │           ├── catch-async.ts
    │           └── jwt.ts
    └── frontend/
        ├── README.md
        ├── components.json
        ├── eslint.config.mjs
        ├── next.config.ts
        ├── package.json
        ├── postcss.config.mjs
        ├── tsconfig.json
        └── src/
            ├── app/
            │   ├── globals.css
            │   ├── layout.tsx
            │   ├── page.tsx
            │   ├── (auth)/
            │   │   ├── login/
            │   │   │   └── page.tsx
            │   │   └── register/
            │   │       └── page.tsx
            │   └── dashboard/
            │       └── page.tsx
            ├── components/
            │   ├── tasks/
            │   │   └── TaskModal.tsx
            │   └── ui/
            │       ├── alert-dialog.tsx
            │       ├── button.tsx
            │       └── select.tsx
            ├── context/
            │   └── AuthContext.tsx
            ├── lib/
            │   └── utils.ts
            ├── services/
            │   └── api.service.ts
            └── types/
                ├── auth.ts
                └── task.ts

```

## 🏁 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18+)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [PostgreSQL](https://www.postgresql.org/) database

### 1. Setup Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    -   Create a `.env` file based on `.env.example` (if available) or add:
        ```env
        DATABASE_URL="postgresql://user:password@localhost:5432/taskflow_db"
        PORT=5000
        JWT_SECRET="your_secret_key"
        REFRESH_TOKEN_SECRET="your_refresh_secret"
        FRONTEND_URL="http://localhost:3000"
        ```
4.  Run Prisma migrations:
    ```bash
    npx prisma migrate dev
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```

### 2. Setup Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    -   Create a `.env.local` file:
        ```env
        NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
        ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## 🔌 API Endpoints

### Authentication
-   `POST /api/v1/auth/register` - Register a new user
-   `POST /api/v1/auth/login` - User login
-   `POST /api/v1/auth/refresh-token` - Refresh access token
-   `POST /api/v1/auth/logout` - User logout

### Tasks
-   `GET /api/v1/tasks` - Get all tasks (with filtering)
-   `POST /api/v1/tasks` - Create a new task
-   `PATCH /api/v1/tasks/:id` - Update a task
-   `DELETE /api/v1/tasks/:id` - Delete a task

## 📜 Scripts

### Backend
-   `npm run build`: Compile TypeScript to JavaScript.
-   `npm run start`: Run the compiled production server.
-   `npm run dev`: Build and start the server in development mode.

### Frontend
-   `npm run dev`: Start Next.js in development mode.
-   `npm run build`: Create a production-ready build.
-   `npm run start`: Run the production build.
-   `npm run lint`: Run ESLint checks.
