# Admin Backend - PostgreSQL Setup

This backend uses PostgreSQL with TypeORM for database management and JWT for authentication.

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed

## Database Setup

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE admin_platform;

# Create user (optional - if you want a separate user)
CREATE USER admin_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE admin_platform TO admin_user;

# Exit psql
\q
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres  # or your custom user
DB_PASSWORD=postgres  # or your custom password
DB_NAME=admin_platform
JWT_SECRET=change-this-to-a-secure-random-string
```

### 4. Seed the Database

Run the seed script to create the initial admin user:

```bash
nx run admin-backend:seed
```

This will create an admin user with:
- Email: `admin@example.com`
- Password: `admin123`

### 5. Start the Backend

```bash
nx dev admin-backend
```

The backend will automatically:
- Connect to PostgreSQL
- Sync the database schema (in development mode)
- Start on port 3000

## API Endpoints

### POST /auth/login
Authenticate a user and receive a JWT token.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## Protected Routes

To protect routes with JWT authentication, use the `JwtAuthGuard`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProtectedData() {
    return { message: 'This is protected data' };
  }
}
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String, Optional)
- `password` (String, Bcrypt hashed)
- `role` (Enum: 'admin' | 'user')
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## Security Notes

⚠️ **Important for Production:**

1. Change `JWT_SECRET` to a strong, random string
2. Set `NODE_ENV=production`
3. Set `synchronize: false` in TypeORM config (use migrations instead)
4. Use environment-specific configurations
5. Enable HTTPS
6. Set up proper CORS origins
7. Use httpOnly cookies for tokens instead of localStorage

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo service postgresql status
   ```

2. Check database exists:
   ```bash
   psql -l
   ```

3. Verify credentials in `.env` file

### Seed Script Issues

If seeding fails, ensure:
- Database is created
- Database connection is working
- No existing admin user with the same email
