import { IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  //   @MinLength(6)
  @IsNotEmpty()
  password: string;
}
