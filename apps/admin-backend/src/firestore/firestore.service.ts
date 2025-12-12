import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirebaseConfig, validateFirebaseConfig } from '@admin-platform/shared-firebase';

@Injectable()
export class FirestoreService implements OnModuleInit {
  private readonly logger = new Logger(FirestoreService.name);
  private firestore: admin.firestore.Firestore;

  onModuleInit() {
    if (!admin.apps.length) {
      // In Cloud Run, use Application Default Credentials
      if (process.env.K_SERVICE) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        this.logger.log(
          'Firebase Admin initialized with Application Default Credentials',
        );
      } else {
        // In local development, use service account from env vars
        const config = getFirebaseConfig();

        if (!validateFirebaseConfig(config)) {
          throw new Error(
            'Invalid Firebase configuration. Check your environment variables.',
          );
        }

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: config.projectId,
            privateKey: config.privateKey,
            clientEmail: config.clientEmail,
          }),
          databaseURL: config.databaseURL,
          storageBucket: config.storageBucket,
        });
        this.logger.log('Firebase Admin initialized with service account');
      }
    }

    this.firestore = admin.firestore();
  }

  /**
   * Apply environment prefix to collection name
   * @param collection - The base collection name
   * @param environment - The environment (production or qa)
   */
  private applyEnvironmentPrefix(
    collection: string,
    environment?: string,
  ): string {
    if (environment && environment.toLowerCase() === 'qa') {
      return `QA_${collection}`;
    }
    return collection;
  }

  /**
   * Get a single document by ID from a collection
   */
  async getDocument<T = any>(
    collection: string,
    documentId: string,
    environment?: string,
  ): Promise<T | null> {
    const collectionName = this.applyEnvironmentPrefix(collection, environment);
    try {
      const doc = await this.firestore
        .collection(collectionName)
        .doc(documentId)
        .get();

      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() } as T;
    } catch (error) {
      this.logger.error(
        `Error getting document ${documentId} from ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get all documents from a collection
   */
  async getCollection<T = any>(collection: string, environment?: string): Promise<T[]> {
    try {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      const snapshot = await this.firestore.collection(collectionName).get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      this.logger.error(`Error getting collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Query documents with conditions
   */
  async queryDocuments<T = any>(
    collection: string,
    field: string,
    operator: admin.firestore.WhereFilterOp,
    value: any,
    environment?: string,
  ): Promise<T[]> {
    try {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      const snapshot = await this.firestore
        .collection(collectionName)
        .where(field, operator, value)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      this.logger.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document
   */
  async updateDocument(
    collection: string,
    documentId: string,
    data: any,
    environment?: string,
  ): Promise<void> {
    const collectionName = this.applyEnvironmentPrefix(collection, environment);
    try {
      await this.firestore
        .collection(collectionName)
        .doc(documentId)
        .set(data, { merge: true });
      this.logger.log(`Document ${documentId} updated in ${collectionName}`);
    } catch (error) {
      this.logger.error(
        `Error updating document ${documentId} in ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get documents with pagination
   */
  async getCollectionPaginated<T = any>(
    collection: string,
    limit: number = 10,
    startAfterDoc?: admin.firestore.DocumentSnapshot,
    environment?: string,
  ): Promise<{
    documents: T[];
    lastDoc: admin.firestore.DocumentSnapshot | null;
  }> {
    try {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      let query = this.firestore.collection(collectionName).limit(limit);

      if (startAfterDoc) {
        query = query.startAfter(startAfterDoc);
      }

      const snapshot = await query.get();

      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      const lastDoc =
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null;

      return { documents, lastDoc };
    } catch (error) {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      this.logger.error(
        `Error getting paginated collection ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Create or update a document
   */
  async setDocument(
    collection: string,
    documentId: string,
    data: any,
    environment?: string,
  ): Promise<void> {
    try {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      await this.firestore
        .collection(collectionName)
        .doc(documentId)
        .set(data, { merge: true });
      this.logger.log(`Document ${documentId} set in ${collectionName}`);
    } catch (error) {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      this.logger.error(
        `Error setting document ${documentId} in ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Add a new document with auto-generated ID
   */
  async addDocument(collection: string, data: any, environment?: string): Promise<string> {
    try {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      const docRef = await this.firestore.collection(collectionName).add(data);
      this.logger.log(`Document ${docRef.id} added to ${collectionName}`);
      return docRef.id;
    } catch (error) {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      this.logger.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(collection: string, documentId: string, environment?: string): Promise<void> {
    try {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      await this.firestore.collection(collectionName).doc(documentId).delete();
      this.logger.log(`Document ${documentId} deleted from ${collectionName}`);
    } catch (error) {
      const collectionName = this.applyEnvironmentPrefix(collection, environment);
      this.logger.error(
        `Error deleting document ${documentId} from ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get Firestore instance for advanced queries
   */
  getFirestoreInstance(): admin.firestore.Firestore {
    return this.firestore;
  }

  /**
   * Get total number of authenticated users
   */
  async getAuthenticatedUsersCount(): Promise<number> {
    try {
      let userCount = 0;
      let nextPageToken: string | undefined;

      do {
        const listUsersResult = await admin
          .auth()
          .listUsers(1000, nextPageToken);
        userCount += listUsersResult.users.length;
        nextPageToken = listUsersResult.pageToken;
      } while (nextPageToken);

      this.logger.log(`Total authenticated users: ${userCount}`);
      return userCount;
    } catch (error) {
      this.logger.error('Error getting authenticated users count:', error);
      throw error;
    }
  }

  /**
   * Get user growth data for a specific month (daily user counts)
   */
  async getUserGrowthForMonth(
    year: number,
    month: number,
  ): Promise<{
    dailyData: { date: string; count: number }[];
    totalUsers: number;
  }> {
    try {
      // Map to store daily counts
      const dailyCounts = new Map<string, number>();

      // Calculate start and end dates for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      let nextPageToken: string | undefined;
      let totalUsers = 0;

      do {
        const listUsersResult = await admin
          .auth()
          .listUsers(1000, nextPageToken);

        totalUsers += listUsersResult.users.length;

        listUsersResult.users.forEach((user) => {
          if (user.metadata.creationTime) {
            const createdDate = new Date(user.metadata.creationTime);

            // Only count users created in the specified month
            if (createdDate >= startDate && createdDate <= endDate) {
              const dateStr = createdDate.toISOString().split('T')[0];
              const currentCount = dailyCounts.get(dateStr) || 0;
              dailyCounts.set(dateStr, currentCount + 1);
            }
          }
        });

        nextPageToken = listUsersResult.pageToken;
      } while (nextPageToken);

      // Convert to array and sort by date
      const dailyData = Array.from(dailyCounts.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      this.logger.log(
        `User growth data for ${year}-${month}: ${dailyData.length} days of data, ${totalUsers} total users`,
      );
      return { dailyData, totalUsers };
    } catch (error) {
      this.logger.error('Error getting user growth data for month:', error);
      throw error;
    }
  }

  /**
   * Get available months that have user data
   * Returns months from the earliest user creation to now
   */
  async getAvailableUserGrowthMonths(): Promise<string[]> {
    try {
      // Get first user to determine start date
      const firstUserResult = await admin.auth().listUsers(1);

      if (firstUserResult.users.length === 0) {
        return [];
      }

      // Find the earliest creation date by checking a sample of users
      let earliestDate = new Date();
      let nextPageToken: string | undefined;
      let sampleCount = 0;
      const maxSamples = 100; // Check first 100 users to find earliest date

      do {
        const listUsersResult = await admin
          .auth()
          .listUsers(100, nextPageToken);

        listUsersResult.users.forEach((user) => {
          if (user.metadata.creationTime) {
            const createdDate = new Date(user.metadata.creationTime);
            if (createdDate < earliestDate) {
              earliestDate = createdDate;
            }
          }
        });

        sampleCount += listUsersResult.users.length;
        nextPageToken = listUsersResult.pageToken;
      } while (nextPageToken && sampleCount < maxSamples);

      // Generate list of months from earliest to now
      const months: string[] = [];
      const currentDate = new Date();
      const startDate = new Date(
        earliestDate.getFullYear(),
        earliestDate.getMonth(),
        1,
      );

      let iterDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );

      while (iterDate >= startDate) {
        const monthKey = `${iterDate.getFullYear()}-${String(iterDate.getMonth() + 1).padStart(2, '0')}`;
        months.push(monthKey);
        iterDate.setMonth(iterDate.getMonth() - 1);
      }

      this.logger.log(
        `Available user growth months: ${months.length} months (from ${startDate.toISOString().split('T')[0]} to now)`,
      );
      return months;
    } catch (error) {
      this.logger.error('Error getting available user growth months:', error);
      throw error;
    }
  }

  /**
   * Get user growth data for the last month (daily user counts)
   */
  async getUserGrowthLastMonth(): Promise<{ date: string; count: number }[]> {
    try {
      // Map to store daily counts
      const dailyCounts = new Map<string, number>();

      let nextPageToken: string | undefined;

      do {
        const listUsersResult = await admin
          .auth()
          .listUsers(1000, nextPageToken);

        listUsersResult.users.forEach((user) => {
          if (user.metadata.creationTime) {
            const createdDate = new Date(user.metadata.creationTime);
            const dateStr = createdDate.toISOString().split('T')[0];
            const currentCount = dailyCounts.get(dateStr) || 0;
            dailyCounts.set(dateStr, currentCount + 1);
          }
        });

        nextPageToken = listUsersResult.pageToken;
      } while (nextPageToken);

      // Convert to array and sort by date
      const result = Array.from(dailyCounts.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      this.logger.log(
        `User growth data retrieved: ${result.length} days of data`,
      );
      return result;
    } catch (error) {
      this.logger.error('Error getting user growth data:', error);
      throw error;
    }
  }
}
