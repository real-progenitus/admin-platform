# Admin Platform

This is an Nx monorepo for the Admin Platform, containing both the backend API and the admin panel frontend.

## Structure

```
admin-platform/
├── apps/
│   ├── admin-backend/     # NestJS backend API
│   └── admin-panel/       # Next.js admin panel
├── libs/
│   ├── shared-types/      # Shared TypeScript types
│   ├── shared-utils/      # Shared utilities
│   ├── shared-auth/       # Shared authentication logic
│   └── shared-firebase/   # Firebase Admin shared provider
└── tools/
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Development

Run both applications in development mode:

```bash
npm run dev
```

Run individual applications:

```bash
# Backend
npm run admin-backend:dev

# Frontend
npm run admin-panel:dev
```

### Build

Build all applications:

```bash
npm run build
```

Build individual applications:

```bash
# Backend
npm run admin-backend:build

# Frontend
npm run admin-panel:build
```

### Test

Run tests for all applications:

```bash
npm run test
```

Run tests for individual applications:

```bash
# Backend
npm run admin-backend:test

# Frontend
npm run admin-panel:test
```

## Nx Commands

This project uses [Nx](https://nx.dev) for monorepo management.

### Run tasks

```bash
# Run a specific task for a project
nx <target> <project>

# Example: Run dev for admin-backend
nx dev admin-backend

# Run a task for all projects
nx run-many --target=<target> --all

# Example: Run build for all projects
nx run-many --target=build --all
```

### Graph

View the project graph:

```bash
nx graph
```

### Affected commands

Run tasks only for affected projects:

```bash
nx affected --target=build
nx affected --target=test
nx affected --target=lint
```

## Learn More

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
