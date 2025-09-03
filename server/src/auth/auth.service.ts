import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from 'src/users/dto/register.dto';
import { LoginDto } from 'src/users/dto/login.dto';

export interface UserResponse {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: UserResponse;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private signAccess(jwtPayload: JwtPayload) {
    return this.jwtService.sign(jwtPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
  }
  private signRefresh(jwtPayload: JwtPayload) {
    return this.jwtService.sign(jwtPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });
  }

  async getTokens(
    user: UserResponse,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.signAccess(payload);
    const refreshToken = this.signRefresh(payload);
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService
      .findOneByEmail(dto.email)
      .catch(() => null);
    if (existingUser) throw new BadRequestException('User exists');
    const user = await this.usersService.create(dto);
    const tokens = await this.getTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const hashedRt = await bcrypt.hash(tokens.refreshToken, 12);
    await this.usersService.setRefreshTokenHash(user.id, hashedRt);
    return { user, tokens };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponse | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await this.comparePasswords(password, user.passwordHash))) {
      return { id: user.id, email: user.email, role: user.role };
    }
    return null;
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.getTokens(user);
    const hashedRt = await bcrypt.hash(tokens.refreshToken, 12);
    await this.usersService.setRefreshTokenHash(user.id, hashedRt);
    return { user, tokens };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.currentHashedRefreshToken)
      throw new UnauthorizedException();
    const valid = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (!valid) throw new UnauthorizedException();

    const tokens = await this.getTokens(user);
    const newHashed = await bcrypt.hash(tokens.refreshToken, 12);
    await this.usersService.setRefreshTokenHash(user.id, newHashed);
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.setRefreshTokenHash(userId, null);
  }
}
