import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService, JwtObject } from './auth.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { RegisterDto } from 'src/users/dto/register.dto';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    console.log('Registering user:', registerDto);
    return this.authService.register(registerDto);
  }

  //   @UseGuards(AuthGuard) // not needed since using global auth
  @Get('profile')
  getProfile(@Request() req: { user: JwtObject }) {
    return req.user;
  }

  @Public()
  @Get()
  findAll() {
    return [{ hi: 'hi' }];
  }
}
