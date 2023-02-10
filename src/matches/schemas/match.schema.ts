import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  Contender,
  ContenderSchema,
} from '../contenders/schemas/contender.schema';

export type MatchDocument = Match & Document;

@Schema()
export class Match {
  @Prop()
  title: string;

  @Prop({ type: [ContenderSchema], defaultValue: [] })
  contenders: Contender[];

  @Prop({ type: ContenderSchema, defaultValue: null })
  winner: Contender | null;

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  event: string;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
