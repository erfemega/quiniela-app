import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contender, ContenderDocument } from './schemas/contender.schema';
import { CreateContenderDto } from './dtos/CreateContender.dto';
import { Model } from 'mongoose';

@Injectable()
export class ContendersService {
  constructor(
    @InjectModel(Contender.name)
    private readonly contenderModel: Model<ContenderDocument>,
  ) {}

  // async addContenders(matchId: string, contenderDtos: CreateContenderDto[]): Promise<Contender[]> {

  // }
}
