import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty if provided.' })
  title: string;
  @IsOptional()
  @IsString()
  description: string;
}
