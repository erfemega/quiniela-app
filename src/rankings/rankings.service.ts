import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ranking, RankingDocument } from './schemas/ranking.schema';
import { EventDocument } from 'src/events/schemas/event.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel(Ranking.name)
    private readonly rankingModel: Model<RankingDocument>,
  ) {}

  async addRanking(event: EventDocument, user: UserDocument) {
    const newRanking = await this.rankingModel.create({
      event: event._id,
      owner: user._id,
      points: 0,
    });

    newRanking.save();
  }

  async addPointsToWinners(event, winners) {
    const winnersObjectIds = winners.map((winner) => winner._id);
    await this.rankingModel.updateMany(
      {
        event: event._id,
        owner: { $in: winnersObjectIds },
      },
      { $inc: { points: 1 } },
    );
  }

  async removePointsToWinners(event, winners) {
    const winnersObjectIds = winners.map((winner) => winner._id);
    await this.rankingModel.updateMany(
      {
        event: event._id,
        owner: { $in: winnersObjectIds },
      },
      { $inc: { points: -1 } },
    );
  }

  async getRankingsByEvent(eventId: string): Promise<RankingDocument[]> {
    const rankings = await this.rankingModel
      .find({
        event: new Types.ObjectId(eventId),
      })
      .sort({ points: -1 })
      .exec();
    return rankings;
  }
}
