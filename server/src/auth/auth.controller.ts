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
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    console.log(req, " ", req.user);
    await this.authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard) 
  @Get('profile')
  getProfile(@Req() req: { user: JwtPayload }) {
    return req.user;
  }

  @Get('public')
  findAll() {
    return [{ hi: 'hi' }];
  }
}
