import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  Contender,
  ContenderDocument,
  ContenderSchema,
} from '../contenders/schemas/contender.schema';
import { Prediction } from 'src/predictions/schemas/prediction.schema';

export type MatchDocument = Match & Document;

@Schema()
export class Match {
  @Prop()
  title: string;

  @Prop({ type: [ContenderSchema], defaultValue: [] })
  contenders: ContenderDocument[];

  @Prop({ type: ContenderSchema, defaultValue: null })
  winner: ContenderDocument | null;

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  event: string;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
