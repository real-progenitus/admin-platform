# Admin Backend

NestJS backend for the Admin Platform with PostgreSQL, TypeORM, and JWT authentication.

## Features

- 🔐 JWT-based authentication
- 🗄️ PostgreSQL database with TypeORM
- 🔒 Bcrypt password hashing
- 🛡️ Passport.js authentication strategy
- 📝 User management
- 🚀 Auto-schema synchronization in development

## Quick Start

### 1. Install Dependencies

From the workspace root:
```bash
npm install
```

### 2. Setup Database

**Option A: Automated Setup (Recommended)**
```bash
cd apps/admin-backend
./setup-db.sh
```

**Option B: Manual Setup**

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

### 3. Seed the Database

Create the initial admin user:
```bash
nx run admin-backend:seed
```

Default credentials:
- Email: `admin@example.com`
- Password: `admin123`

### 4. Start the Server

```bash
nx dev admin-backend
```

Server runs on `http://localhost:3000`

## Environment Variables

Create a `.env` file (use `.env.example` as template):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=admin_platform

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Server
PORT=3000
NODE_ENV=development
```

## API Endpoints

### Authentication

**POST /auth/login**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## Project Structure

```
src/
├── auth/               # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── database/           # Database configuration
│   ├── database.module.ts
│   └── entities/
│       └── user.entity.ts
├── app.module.ts
├── main.ts
└── seed.ts            # Database seeding script
```

## Development

```bash
# Development with watch mode
nx dev admin-backend

# Build
nx build admin-backend

# Run tests
nx test admin-backend

# Lint
nx lint admin-backend

# Seed database
nx run admin-backend:seed
```

## Testing

```bash
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
