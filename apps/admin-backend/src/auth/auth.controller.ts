import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@admin-platform/shared-auth';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard) // Requires authentication
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerRequest: RegisterRequest): Promise<{
    message: string;
    user: { id: string; email: string; role: string };
  }> {
    return this.authService.register(registerRequest);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard) // Requires authentication
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<
    Array<{
      id: string;
      email: string;
      name?: string;
      role: string;
      createdAt: Date;
    }>
  > {
    return this.authService.getUsers();
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard) // Requires authentication
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id') userId: string,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const user = (request as any).user;
    return this.authService.deleteUser(userId, user.role);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginRequest: LoginRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    const result = await this.authService.login(loginRequest);

    // Set refresh token in httpOnly cookie
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh',
    });

    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const result = await this.authService.refreshToken(refreshToken);

    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    response.clearCookie('refreshToken', { path: '/auth/refresh' });
    return { message: 'Logged out successfully' };
  }
}
