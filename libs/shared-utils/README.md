# shared-utils

Shared utility functions used across the admin platform.

## Usage

```typescript
import { isValidEmail, formatDate, Logger } from '@admin-platform/shared-utils';

// Validation
const valid = isValidEmail('test@example.com');

// Formatting
const formatted = formatDate(new Date(), 'long');

// Logging
const logger = new Logger('MyService');
logger.info('Service started');
```
