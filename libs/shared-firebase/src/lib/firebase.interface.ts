export interface FirebaseConfig {
  projectId: string;
  privateKey?: string;
  clientEmail?: string;
  databaseURL?: string;
  storageBucket?: string;
}

export interface FirebaseAdminConfig {
  credential: any;
  databaseURL?: string;
  storageBucket?: string;
}

export const FIREBASE_CONFIG_TOKEN = 'FIREBASE_CONFIG';
export const FIREBASE_ADMIN_TOKEN = 'FIREBASE_ADMIN';
