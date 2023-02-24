import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../enums/status.enum';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class AddPredictionDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  owner: string;

  @IsOptional()
  @Type(() => Types.ObjectId)
  winner: string;

  @IsString()
  @IsNotEmpty()
  status: Status;

  @IsString()
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  event: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  match: string;
}
