# Contributing to openclaw-plugin-izipay

Thank you for considering a contribution!

## Quick Links

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Architecture Overview](#architecture)

## Development Setup

```bash
# Clone
git clone https://github.com/your-org/openclaw-plugin-izipay
cd openclaw-plugin-izipay

# Install (requires pnpm 9+)
pnpm install

# Copy env template
cp .env.example .env
# Edit .env with your sandbox API key

# Run type-check
pnpm run typecheck

# Run tests
pnpm test

# Build
pnpm run build
```

## Branch Naming

| Type | Prefix | Example |
|------|--------|---------|
| Feature | `feat/` | `feat/add-refund-tool` |
| Fix | `fix/` | `fix/payment-status-error-handling` |
| Docs | `docs/` | `docs/update-readme` |
| Refactor | `refactor/` | `refactor/client-error-classes` |
| Chore | `chore/` | `chore/update-deps` |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`

Examples:
```
feat(tools): add refund tool for Izipay payments
fix(client): handle 429 rate limit with exponential backoff
docs(readme): add sandbox vs production config examples
```

## Pull Request Process

1. **Create issue first** for features/fixes (skip for trivial docs)
2. **Branch from `main`** with proper prefix
3. **Write tests** for new functionality
4. **Run full check** locally:
   ```bash
   pnpm run typecheck && pnpm test && pnpm run build
   ```
5. **Open PR** with:
   - Clear title (conventional commit format)
   - Description of changes
   - Link to issue
   - Screenshots/logs if relevant
6. **CI must pass** (typecheck, tests, build)
7. **Review** - address feedback
8. **Squash & merge** - maintainers handle

## Code Style

- **TypeScript strict mode** - no `any`, use proper types
- **TypeBox** for schemas (runtime validation + metadata)
- **Zod** only for complex transforms (not schemas)
- **ESM only** - no CommonJS
- **Minimal comments** - code should be self-documenting
- **Error classes** for all failure modes

## Architecture

```
src/
├── client/           # HTTP client + auth + errors
│   ├── izipay-client.ts
│   ├── auth.ts
│   ├── endpoints.ts
│   └── errors.ts
├── tools/            # Tool implementations (register via defineToolPlugin)
│   ├── create-payment.ts
│   ├── payment-status.ts
│   └── payment-details.ts
├── schemas/          # TypeBox schemas (config + tool params + results)
│   ├── config.ts
│   └── payment.ts
├── types/            # Pure TypeScript interfaces
│   └── api.ts
└── utils/            # Shared helpers
```

## Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

- Test files: `*.test.ts` co-located with source
- Use `vitest` with `node` environment
- Mock HTTP with `msw` or manual fetch mocking
- Test error paths (401, 429, 500, network failure)

## Adding a New Tool

1. Define params/result schemas in `src/schemas/payment.ts`
2. Create tool in `src/tools/new-tool.ts`
3. Export from `src/tools/index.ts`
4. Register in `index.ts` via `defineToolPlugin`
5. Add tool name to `openclaw.plugin.json` → `contracts.tools`
6. Write tests
7. Update README if user-facing

## Releasing

Maintainers only:

```bash
# Version bump (patch/minor/major)
pnpm version patch

# Build + validate
pnpm run build
pnpm run plugin:validate

# Publish to npm
npm publish

# Tag release
git push --follow-tags
```

## Questions?

Open a [Discussion](https://github.com/your-org/openclaw-plugin-izipay/discussions) or check [OpenClaw Discord](https://discord.gg/openclaw).