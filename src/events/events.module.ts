import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { MatchesModule } from 'src/matches/matches.module';
import { UsersModule } from 'src/users/users.module';
import { PredictionsModule } from 'src/predictions/predictions.module';
import { RankingsModule } from 'src/rankings/rankings.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
    MatchesModule,
    UsersModule,
    PredictionsModule,
    RankingsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
