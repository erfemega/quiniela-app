import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesModule } from './matches/matches.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PredictionsModule } from './predictions/predictions.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    EventsModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    MatchesModule,
    UsersModule,
    AuthModule,
    PredictionsModule,
    RankingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
