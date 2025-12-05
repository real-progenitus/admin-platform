import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '@admin-platform/shared-types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // Disabled: Create your super admin through the UI on first login
    // await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    try {
      // Check if admin user already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { email: 'admin@example.com' },
      });

      if (existingAdmin) {
        console.log('✅ Admin user already exists');
        return;
      }

      // Create admin user
      const adminUser = new User();
      adminUser.email = 'admin@example.com';
      adminUser.name = 'Admin User';
      adminUser.password = await bcrypt.hash('admin123', 10);
      adminUser.role = UserRole.ADMIN;

      await this.userRepository.save(adminUser);

      console.log('✅ Admin user created successfully');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
    } catch (error) {
      console.error('❌ Error creating admin user:', error.message);
    }
  }
}
