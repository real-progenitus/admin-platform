# shared-firebase

Shared Firebase Admin configuration and utilities.

## Usage

### Backend (NestJS)

```typescript
import { getFirebaseConfig, validateFirebaseConfig } from '@admin-platform/shared-firebase';

const config = getFirebaseConfig();
if (validateFirebaseConfig(config)) {
  // Initialize Firebase Admin
}
```

## Environment Variables

Required environment variables:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

Optional:
- `FIREBASE_DATABASE_URL`
- `FIREBASE_STORAGE_BUCKET`
