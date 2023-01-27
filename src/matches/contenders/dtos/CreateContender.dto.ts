import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContenderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  mainText: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image: string;
}
