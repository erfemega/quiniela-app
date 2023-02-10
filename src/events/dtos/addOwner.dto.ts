import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AddOwnerDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
