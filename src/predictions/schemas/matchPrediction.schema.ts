import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Contender } from 'src/matches/contenders/schemas/contender.schema';
import { Match } from 'src/matches/schemas/match.schema';

export type MatchDocument = MatchPrediction & Document;

@Schema()
export class MatchPrediction {
  @Prop({ type: Types.ObjectId, ref: 'Match' })
  match: Match;

  @Prop({ type: Types.ObjectId, ref: 'Contender', default: null })
  winner: Contender | null;
}

export const MatchSchema = SchemaFactory.createForClass(MatchPrediction);
