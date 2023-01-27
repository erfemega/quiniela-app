import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesModule } from './matches/matches.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    EventsModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    MatchesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
