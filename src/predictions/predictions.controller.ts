import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth0Guard } from 'src/auth/guards/auth0.guard';
import { PredictionsService } from './predictions.service';
import { AddMatchResult } from 'src/matches/dtos/addMatchResult.dto';
import { PredictionSettableGuard } from './guards/PredictionSettable.guard';

@ApiTags('Predictions')
@ApiBearerAuth()
@Controller('predictions')
export class PredictionsController {
  constructor(private predictionsService: PredictionsService) {}

  @UseGuards(Auth0Guard)
  @Get(':eventId')
  async getPredictions(@Param('eventId') eventId: string, @Request() req) {
    const predictions = await this.predictionsService.getEventPredictions(
      eventId,
      req.user,
    );
    return predictions;
  }

  @UseGuards(Auth0Guard, PredictionSettableGuard)
  @Patch(':predictionId')
  async setPredictionResult(
    @Param('predictionId') predictionId: string,
    @Body() addPredictionResult: AddMatchResult,
  ) {
    const { contenderId } = addPredictionResult;
    const updatedPrediction = await this.predictionsService.setPrediction(
      predictionId,
      contenderId,
    );
    return updatedPrediction;
  }
}
