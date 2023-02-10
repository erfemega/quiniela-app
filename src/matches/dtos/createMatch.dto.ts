import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Contender } from '../contenders/schemas/contender.schema';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateContenderDto } from '../contenders/dtos/CreateContender.dto';
import { Type } from 'class-transformer';

export class CreateMatchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsArray()
  @ArrayMinSize(2)
  @ApiProperty({ type: [CreateContenderDto], minItems: 2 })
  @ValidateNested({ each: true })
  @Type(() => CreateContenderDto)
  contenders: CreateContenderDto[];

  @IsOptional()
  winner: Contender;

  @IsOptional()
  event: string;
}

export class UpdateMatchDto extends PartialType(CreateMatchDto) {}
