import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from 'src/users/dto/register.dto';
import { LoginDto } from 'src/users/dto/login.dto';

export interface AuthResponse {
  access_token: string;
  id: number;
}

export interface JwtObject {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateJWT(id: number, email: string, role: string) {
    const jwtObject: JwtObject = { id, email, role };
    return this.jwtService.signAsync(jwtObject);
  }
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const hashedPassword = await this.hashPassword(dto.password);
    const existingUser = await this.usersService
      .findOneByEmail(dto.email)
      .catch(() => null);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
    const jwt = await this.generateJWT(user.id, user.email, user.role);
    return { access_token: jwt, id: user.id };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await this.comparePasswords(pass, user.password))) {
      return { email: user.email, role: user.role };
    }
    return null;
  }

  async signIn(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.comparePasswords(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const jwt = await this.generateJWT(user.id, user.email, user.role);
    return { access_token: jwt, id: user.id };
  }
}
