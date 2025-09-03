import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'defaultSecret',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES || '1h' },
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, 
  ],
})
export class AuthModule {}
