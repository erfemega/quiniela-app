import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddMatchResult {
  @ApiProperty()
  @IsString()
  contenderId: string;
}
