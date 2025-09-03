import { IsString, IsNotEmpty } from "class-validator";

export class CreateItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty.' })
  title: string;
  @IsString()
  description: string;
}
