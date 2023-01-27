import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match, MatchDocument } from './schemas/match.schema';
import { Model } from 'mongoose';
import { CreateMatchDto, UpdateMatchDto } from './dtos/createMatch.dto';
import { MatchNotFoundException } from './exceptions/MatchNotFound.exception';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private readonly matchModel: Model<MatchDocument>,
  ) {}

  async getMatches(): Promise<Match[]> {
    const matches = await this.matchModel.find().exec();
    return matches;
  }

  async addMatch(createMatchDto: CreateMatchDto): Promise<Match> {
    const match = await this.matchModel.create({
      ...createMatchDto,
      winner: null,
    });
    return match.save();
  }

  async getMatchById(matchId): Promise<Match> {
    const match = await this.matchModel.findById(matchId).exec();
    if (!match) throw new MatchNotFoundException(matchId);
    return match;
  }

  async updateMatch(
    matchId: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    const updatedMatch = await this.matchModel.findByIdAndUpdate(
      matchId,
      updateMatchDto,
      { new: true },
    );
    if (!updatedMatch) throw new MatchNotFoundException(matchId);
    return updatedMatch;
  }

  async deleteAllMatchesFromEvent(eventId: string) {
    const matches = await this.matchModel.find({ eventId: eventId });
    console.log(matches);
    const deletedMatches = this.matchModel.deleteMany({ eventId });
    return deletedMatches;
  }
}
