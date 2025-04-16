# Next.js tRPC Todo Application

A modern Todo application built with Next.js, tRPC, Prisma, and PostgreSQL. This application demonstrates a full-stack TypeScript implementation with type-safe API calls using tRPC.

## Features

- 🚀 Next.js 14 with App Router
- 🔒 Type-safe API calls with tRPC
- 🎨 Modern UI with Tailwind CSS
- 📦 PostgreSQL database with Prisma ORM
- 🔄 Real-time updates with React Query
- 📝 Form handling with React Hook Form
- 🎯 State management with Zustand
- 🔔 Toast notifications

## Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nextjs-trpc-todo.git
cd nextjs-trpc-todo
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file and add your PostgreSQL database URL:

```
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

4. Set up the database:

```bash
# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev
```

5. Start the development server:

```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality

## Database Commands

- `pnpm prisma generate` - Generate Prisma Client
- `pnpm prisma migrate dev` - Create and apply database migrations
- `pnpm prisma studio` - Open Prisma Studio to view/edit database data
- `pnpm prisma db push` - Push schema changes to the database without creating migrations

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── server/           # tRPC server setup and routers
│   ├── components/       # React components
│   └── utils/            # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
└── public/              # Static assets
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React Query](https://tanstack.com/query/latest) - Data fetching
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation

## License

MIT
