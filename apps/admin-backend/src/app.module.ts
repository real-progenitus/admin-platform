import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { FirestoreModule } from './firestore/firestore.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [DatabaseModule, AuthModule, FirestoreModule, MetricsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
