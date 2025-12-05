# shared-auth

Shared authentication logic and interfaces used across the admin platform.

## Usage

```typescript
import { AuthPayload, LoginRequest, AUTH_CONSTANTS } from '@admin-platform/shared-auth';

// Use auth interfaces
const loginData: LoginRequest = {
  email: 'user@example.com',
  password: 'password123',
};

// Use auth constants
console.log(AUTH_CONSTANTS.JWT_EXPIRES_IN);
```
