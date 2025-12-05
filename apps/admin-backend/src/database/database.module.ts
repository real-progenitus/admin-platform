import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DatabaseInitService } from './database-init.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'admin_platform',
      entities: [User],
      synchronize: true, // Enable auto-sync (use migrations in production later)
      logging: false, // Disable SQL query logging
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [DatabaseInitService],
})
export class DatabaseModule {}
