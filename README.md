# Claude Bootstrap

A turborepo monorepo starter with Next.js 15 and Express. Designed for non-technical users with strong guardrails.

## Features

- **Full TypeScript strict mode** - Maximum type safety
- **ESLint with strict rules** - No `any` type allowed
- **Prettier** - Consistent code formatting
- **Husky + Commitlint** - Enforced commit conventions
- **Single command development** - `pnpm run dev` starts everything

## Prerequisites

- Node.js >= 20.9.0
- pnpm >= 9.0.0

Install pnpm if you don't have it:

```bash
npm install -g pnpm
```

## Quick Start

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start development servers:
   ```bash
   pnpm run dev
   ```

This starts:

- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:3001 (Express)

## Available Commands

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `pnpm run dev`       | Start all apps in development mode |
| `pnpm run build`     | Build all apps for production      |
| `pnpm run lint`      | Lint all apps                      |
| `pnpm run typecheck` | Type check all apps                |
| `pnpm run format`    | Format all files with Prettier     |

### App-specific commands

```bash
# Run only frontend
pnpm --filter @repo/frontend dev

# Run only backend
pnpm --filter @repo/backend dev

# Add a dependency to frontend
pnpm --filter @repo/frontend add <package>

# Add a dependency to backend
pnpm --filter @repo/backend add <package>
```

## Project Structure

```
├── apps/
│   ├── frontend/          # Next.js 15 with App Router
│   │   ├── src/app/       # Pages and layouts
│   │   └── src/components # React components
│   └── backend/           # Express API server
│       └── src/index.ts   # Server entry point
├── packages/
│   ├── config-typescript/ # Shared TypeScript configs
│   └── config-eslint/     # Shared ESLint configs
├── CLAUDE.md              # AI assistant conventions
└── README.md              # This file
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Express, TypeScript
- **Build**: Turborepo, pnpm workspaces
- **Quality**: ESLint (flat config), Prettier, Husky, Commitlint

## API Endpoints

| Method | Endpoint     | Description                 |
| ------ | ------------ | --------------------------- |
| GET    | `/api/hello` | Returns hello world message |
| GET    | `/health`    | Health check                |

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Your commits must follow this format:

```
type: description

Examples:
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Troubleshooting

### "Command not found: pnpm"

Install pnpm globally: `npm install -g pnpm`

### Type errors on first run

Run `pnpm install` to ensure all dependencies are installed.

### ESLint errors about type checking

Make sure you're running ESLint from the app directory, not the root.

## License

MIT
