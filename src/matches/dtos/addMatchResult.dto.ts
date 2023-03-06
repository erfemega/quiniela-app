import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class AddMatchResult {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  contenderId: string;
}
