import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService, JwtPayload } from './auth.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { RegisterDto } from 'src/users/dto/register.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(body);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      accessToken: tokens.accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.register(registerDto);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      accessToken: tokens.accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rt = req.cookies?.['refreshToken'];
    if (!rt) return { ok: false };
    try {
      const decoded: any = this.jwtService.verify(rt, {
        secret: process.env.JWT_REFRESH_SECRET as string,
      });
      const tokens = await this.authService.refreshTokens(decoded.id, rt);
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return { accessToken: tokens.accessToken };
    } catch (e) {
      return { ok: false };
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request & { user: JwtPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user: JwtPayload }) {
    return req.user;
  }

  @Get('public')
  findAll() {
    return [{ hi: 'hi' }];
  }

  @Post('forgot')
  async forgot(@Body() body: { email: string }) {
    const base = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
    await this.authService.requestPasswordReset(body.email, base);
    return { ok: true };
  }

  @Post('reset')
  async reset(
    @Body() body: { userId: string; token: string; newPassword: string },
  ) {
    await this.authService.resetPassword(body.userId, body.token, body.newPassword);
    return { ok: true };
  }

  // Google OAuth start (frontend typically redirects here)
  @Get('google')
  google() {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL as string,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
      include_granted_scopes: 'true',
      prompt: 'consent',
    });
    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    };
  }
}
