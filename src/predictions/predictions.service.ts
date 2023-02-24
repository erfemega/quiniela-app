import { BadRequestException, Injectable, Post } from '@nestjs/common';
import { PredictionDocument } from './schemas/prediction.schema';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddPredictionDto } from './dtos/AddPrediction.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Status } from './enums/status.enum';
import { MatchDocument } from 'src/matches/schemas/match.schema';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectModel('Prediction')
    private readonly predictionModel: Model<PredictionDocument>,
    private userService: UsersService,
  ) {}

  async addPrediction(
    addPredictionDto: AddPredictionDto,
  ): Promise<PredictionDocument> {
    try {
      const prediction = await this.predictionModel.create(addPredictionDto);
      return prediction.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getEventPredictions(
    eventId: string,
    user: UserDocument,
  ): Promise<PredictionDocument[]> {
    const predictions = await this.predictionModel
      .find({
        event: new Types.ObjectId(eventId),
        owner: user._id,
      })
      .populate('match')
      .populate('event', 'name description')
      .exec();
    return predictions;
  }

  async getPrediction(predictionId: string): Promise<PredictionDocument> {
    const prediction = this.predictionModel.findById(predictionId).exec();
    return prediction;
  }

  async setPrediction(
    predictionId: string,
    contenderId: string,
  ): Promise<PredictionDocument> {
    const prediction = await this.getPrediction(predictionId);
    prediction.winner = contenderId;
    const updatedPrediction = await this.predictionModel.findByIdAndUpdate(
      predictionId,
      prediction,
      { new: true },
    );
    return updatedPrediction;
  }

  async getPredictionsByMatch(matchId: string): Promise<PredictionDocument[]> {
    const predictions = await this.predictionModel
      .find({ match: new Types.ObjectId(matchId) })
      .exec();

    return predictions;
  }

  async ratePredictions(match: MatchDocument) {
    try {
      await this.predictionModel.updateMany(
        {
          match: match._id,
          winner: { $ne: match.winner._id.toString() },
        },
        { status: Status.Lost },
      );
      await this.predictionModel.updateMany(
        {
          match: match._id,
          winner: match.winner._id.toString(),
        },
        { status: Status.Won },
        { new: true },
      );
    } catch (error) {
      await this.resetRatedPredictions(match);
      throw new BadRequestException();
    }
  }

  async resetRatedPredictions(match: MatchDocument) {
    await this.predictionModel.updateMany(
      {
        match: match._id,
      },
      { status: Status.Pending },
    );
  }

  async getMatchWinners(match: MatchDocument) {
    const predictions = await this.predictionModel
      .find({
        match: match._id,
        status: Status.Won,
      })
      .exec();
    return predictions.map(
      (prediction) => new Types.ObjectId(prediction.owner),
    );
  }
}
