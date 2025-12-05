export const AUTH_CONSTANTS = {
  JWT_SECRET: process.env['JWT_SECRET'] || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: '1d',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  BCRYPT_ROUNDS: 10,
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
} as const;
