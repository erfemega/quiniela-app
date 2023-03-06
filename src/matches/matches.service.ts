import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match, MatchDocument } from './schemas/match.schema';
import { Model, Types } from 'mongoose';
import { CreateMatchDto, UpdateMatchDto } from './dtos/createMatch.dto';
import { MatchNotFoundException } from './exceptions/MatchNotFound.exception';
import { PredictionsService } from 'src/predictions/predictions.service';
import { RankingsService } from 'src/rankings/rankings.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private readonly matchModel: Model<MatchDocument>,
    private predictionsService: PredictionsService,
    private rankingService: RankingsService,
  ) {}

  async getMatches(): Promise<MatchDocument[]> {
    const matches = await this.matchModel.find().exec();
    return matches;
  }

  async addMatch(createMatchDto: CreateMatchDto): Promise<MatchDocument> {
    const match = await this.matchModel.create({
      ...createMatchDto,
      winner: null,
    });
    return match.save();
  }

  async getMatchById(matchId, populated = []): Promise<MatchDocument> {
    const match = await this.matchModel
      .findById(matchId)
      .populate(populated)
      .exec();
    if (!match) throw new MatchNotFoundException(matchId);
    return match;
  }

  async updateMatch(
    matchId: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<MatchDocument> {
    const updatedMatch = await this.matchModel.findByIdAndUpdate(
      matchId,
      updateMatchDto,
      { new: true },
    );
    if (!updatedMatch) throw new MatchNotFoundException(matchId);
    return updatedMatch;
  }

  async addMatchResult(matchId: string, contenderId: string) {
    const match = await this.getMatchById(matchId);
    if (match.winner) {
      throw new BadRequestException(
        'Match already has a result, please cancel it before add a new one',
      );
    }
    const contenders: any = match.contenders;
    const contender = contenders.find(
      (contender) => contender._id == contenderId,
    );
    const updatedMatch = await this.updateMatch(matchId, {
      winner: contender,
    });
    await this.predictionsService.ratePredictions(updatedMatch);
    const winners = await this.predictionsService.getMatchWinners(updatedMatch);
    await this.rankingService.addPointsToWinners(
      new Types.ObjectId(updatedMatch.event),
      winners,
    );
    return updatedMatch;
  }

  async resetMatchResult(matchId: string) {
    const match = await this.getMatchById(matchId);
    const updatedMatch = await this.updateMatch(matchId, {
      winner: null,
    });
    const winners = await this.predictionsService.getMatchWinners(updatedMatch);
    await this.rankingService.removePointsToWinners(
      new Types.ObjectId(updatedMatch.event),
      winners,
    );
    await this.predictionsService.resetRatedPredictions(match);
    return updatedMatch;
  }

  async deleteAllMatchesFromEvent(eventId: string) {
    const deletedMatches = this.matchModel.deleteMany({ eventId });
    return deletedMatches;
  }
}
