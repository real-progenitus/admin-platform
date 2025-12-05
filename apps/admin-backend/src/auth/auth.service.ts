import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginRequest, LoginResponse, TokenPayload, RegisterRequest } from '@admin-platform/shared-auth';
import { User } from '../database/entities/user.entity';
import { UserRole } from '@admin-platform/shared-types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerRequest: RegisterRequest): Promise<{
    message: string;
    user: { id: string; email: string; role: string };
  }> {
    const { email, password, name, role } = registerRequest;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = new User();
    user.email = email;
    user.password = password; // Will be auto-hashed by the entity
    user.name = name;
    user.role = role || UserRole.USER; // Use provided role or default to USER

    const savedUser = await this.userRepository.save(user);

    return {
      message: 'User registered successfully',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      },
    };
  }

  async getUsers(): Promise<
    Array<{
      id: string;
      email: string;
      name?: string;
      role: string;
      createdAt: Date;
    }>
  > {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'name', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    return users;
  }

  async deleteUser(
    userId: string,
    requestingUserRole: string,
  ): Promise<{ message: string }> {
    // Only SUPER_ADMIN can delete users
    if (requestingUserRole !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('Only super admins can delete users');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.userRepository.remove(user);

    return {
      message: 'User deleted successfully',
    };
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginRequest;

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT tokens
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token with longer expiry
    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env['JWT_REFRESH_SECRET'] ||
        'refresh-secret-change-in-production',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret:
          process.env['JWT_REFRESH_SECRET'] ||
          'refresh-secret-change-in-production',
      });

      const user = await this.validateUser(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload: TokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
