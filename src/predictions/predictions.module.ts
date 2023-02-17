import { Module } from '@nestjs/common';
import { PredictionsController } from './predictions.controller';
import { PredictionsService } from './predictions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PredictionSchema } from './schemas/prediction.schema';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';
import { MatchesModule } from 'src/matches/matches.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Prediction', schema: PredictionSchema },
    ]),
    UsersModule,
    EventsModule,
    MatchesModule,
  ],
  controllers: [PredictionsController],
  providers: [PredictionsService],
})
export class PredictionsModule {}
