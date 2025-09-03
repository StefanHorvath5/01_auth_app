import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email must not be empty.' })
  email: string;

  //   @MinLength(6)
  @IsNotEmpty({ message: 'Password must not be empty.' })
  password: string;
}
