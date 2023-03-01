import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description: string;

  @IsString()
  @ApiProperty({ example: 'yyyy-mm-dd' })
  finishDate: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
