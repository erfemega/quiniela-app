import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PredictionsService } from '../predictions.service';

@Injectable()
export class PredictionSettableGuard implements CanActivate {
  constructor(private predictionsService: PredictionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user._id;
    const predictionId = request.params.predictionId;
    const prediction = await this.predictionsService.getPrediction(
      predictionId,
      ['event'],
    );
    const isPredictionOwner = prediction.owner.toString() == userId.toString();
    const predictionOnTime = prediction.event;
    return isPredictionOwner;
  }
}
