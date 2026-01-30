# CLAUDE.md - Project Conventions and Rules

This file contains conventions and rules for AI assistants (like Claude) working on this codebase.

## Project Overview

This is a turborepo monorepo with:

- **Frontend**: Next.js 15 with App Router (`apps/frontend`)
- **Backend**: Express.js (`apps/backend`)
- **Shared Packages**: TypeScript and ESLint configs (`packages/`)

## Critical Rules

### TypeScript

1. **FULL STRICT MODE IS ENABLED** - All strict options are on
2. **NO `any` TYPE ALLOWED** - Use `unknown` and narrow types, or define proper interfaces
3. Always use explicit type annotations for function parameters
4. Use `type` imports for type-only imports: `import type { Foo } from './foo'`
5. Never use `@ts-ignore` or `@ts-expect-error` without a detailed comment explaining why

### ESLint

1. ESLint uses **flat config format** (`eslint.config.mjs`)
2. All files must pass linting before commit (enforced by Husky pre-commit hook)
3. Prettier handles formatting - do not add ESLint formatting rules
4. Type-checked rules are enabled - ESLint will catch type issues

### Code Style

1. **Single quotes** for strings (enforced by Prettier)
2. **Trailing commas** in all multi-line constructs (enforced by Prettier)
3. Use functional components in React (no class components)
4. Use async/await over raw promises where possible

### Git Workflow

1. **Conventional Commits** are required:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks
2. Commits are validated by Commitlint (enforced by Husky commit-msg hook)
3. Pre-commit runs: lint and typecheck

### Commit Frequently

**IMPORTANT FOR AI ASSISTANTS**: Commit early and often to preserve progress.

1. **Commit after completing each logical unit of work** - Don't wait until everything is done
2. **Commit when asked by the user** - If the user asks to commit, do it immediately
3. **Commit before starting risky changes** - Create a checkpoint before major refactors
4. **Suggested commit points**:
   - After adding a new feature or endpoint
   - After fixing a bug
   - After adding new components or pages
   - After configuration changes
   - After adding new dependencies
5. **Small, focused commits are better** than large commits with many changes
6. **Always run `pnpm run lint && pnpm run typecheck`** before committing to ensure the commit will succeed

### File Organization

- Frontend components: `apps/frontend/src/components/`
- Frontend pages: `apps/frontend/src/app/`
- Frontend API: `apps/frontend/src/api/`
- Frontend queries: `apps/frontend/src/api/queries/`
- Backend routes: `apps/backend/src/`

### API Structure

The frontend uses a centralized API pattern:

1. **`src/api/api.ts`** - Singleton API class with all HTTP methods
2. **`src/api/queries/`** - Domain-grouped React Query hooks
3. **Query key factories** - Each domain file exports a `*Keys` object for cache management
4. **Add new endpoints**: Add method to API class, create query hook in appropriate file

Example:
```typescript
// In api.ts - add method
getUsers(): Promise<User[]> {
  return this.get<User[]>('/api/users');
}

// In queries/users.ts - add hook
export const useGetUsers = () => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => API.getUsers(),
  });
};
```

### Commands

```bash
# Development (starts both frontend and backend)
pnpm run dev

# Build all apps
pnpm run build

# Lint all apps
pnpm run lint

# Type check all apps
pnpm run typecheck

# Format all files
pnpm run format

# Run specific app
pnpm --filter @repo/frontend dev
pnpm --filter @repo/backend dev
```

### Environment Variables

- Frontend: Use `.env.local` for local development
- Backend: Use `.env` for local development
- Never commit `.env` files

### API Communication

- Backend runs on port 3001
- Frontend runs on port 3000
- Use `/api/` prefix for all backend endpoints
- Configure `NEXT_PUBLIC_API_URL` in frontend for production

## What NOT to Do

1. Do NOT disable TypeScript strict mode
2. Do NOT use `any` type - find a proper type or use `unknown`
3. Do NOT skip pre-commit hooks with `--no-verify`
4. Do NOT commit directly to main branch
5. Do NOT use `var` - use `const` or `let`
6. Do NOT use CommonJS (`require`) in the frontend
7. Do NOT wait too long between commits - commit regularly
