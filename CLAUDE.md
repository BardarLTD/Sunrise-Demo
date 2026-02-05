# CLAUDE.md - Project Conventions and Rules

This file contains conventions and rules for AI assistants (like Claude) working on this codebase.

## Project Overview

This is a turborepo monorepo with:

- **Frontend**: Next.js 15 with App Router (`apps/frontend`)
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
# Development
pnpm run dev

# Build
pnpm run build

# Lint
pnpm run lint

# Type check
pnpm run typecheck

# Format all files
pnpm run format
```

### Environment Variables

The project uses a strict environment variable validation system that **crashes the application** if required variables are missing.

#### Required Variables

**Server-side** (NOT prefixed with `NEXT_PUBLIC_`):

- `OPENROUTER_API_KEY` - API key for OpenRouter (required for AI features)

**Client-side** (MUST be prefixed with `NEXT_PUBLIC_`):

- `NEXT_PUBLIC_MIXPANEL_TOKEN` - Token for Mixpanel analytics

#### Optional Variables

**Server-side**:

- `OPENROUTER_BASE_URL` - OpenRouter API base URL (default: `https://openrouter.ai/api/v1`)
- `OPENROUTER_APP_URL` - App URL for OpenRouter headers (default: `http://localhost:3000`)
- `OPENROUTER_APP_NAME` - App name for OpenRouter headers (default: `Sunrise Demo`)
- `OPENROUTER_MODEL` - Default AI model to use (default: `anthropic/claude-3-5-sonnet`)

**Client-side**:

- `NEXT_PUBLIC_MIXPANEL_API_HOST` - Mixpanel API host (default: `https://api.mixpanel.com`)

#### Setup Instructions

1. Create `.env.local` in `apps/frontend/` with all required variables
2. Never commit `.env` or `.env.local` files
3. If a required variable is missing, the app will crash with a clear error message listing which variables are missing

#### Environment Validation

- Validation runs automatically when the app starts (via `src/lib/env.ts`)
- Server-side validation checks all required variables
- Client-side validation only checks `NEXT_PUBLIC_*` variables
- Missing variables will cause immediate crash with clear error messages
- All environment variables are accessed through the typed `env` object exported from `src/lib/env.ts`

## What NOT to Do

1. Do NOT disable TypeScript strict mode
2. Do NOT use `any` type - find a proper type or use `unknown`
3. Do NOT skip pre-commit hooks with `--no-verify`
4. Do NOT commit directly to main branch
5. Do NOT use `var` - use `const` or `let`
6. Do NOT use CommonJS (`require`) in the frontend
7. Do NOT wait too long between commits - commit regularly
