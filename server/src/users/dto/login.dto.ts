import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  //   @MinLength(6)
  @IsNotEmpty()
  password: string;
}
