import { Injectable } from '@nestjs/common';
import { Prediction } from './schemas/prediction.schema';

@Injectable()
export class PredictionsService {
  async createPrediction(user, event): Promise<Prediction> {
    return await null;
  }
}
