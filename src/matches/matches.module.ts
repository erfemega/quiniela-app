import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchesService } from './matches.service';
import { ContendersModule } from './contenders/contenders.module';
import { MatchesController } from './matches.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    ContendersModule,
  ],
  providers: [MatchesService],
  exports: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
