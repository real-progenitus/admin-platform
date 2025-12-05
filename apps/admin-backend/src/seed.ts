import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User } from './database/entities/user.entity';
import { UserRole } from '@admin-platform/shared-types';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const userRepository = dataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User();
    adminUser.email = 'admin@example.com';
    adminUser.name = 'Admin User';
    adminUser.password = await bcrypt.hash('admin123', 10);
    adminUser.role = UserRole.ADMIN;

    await userRepository.save(adminUser);

    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed();
