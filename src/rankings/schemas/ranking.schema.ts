import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RankingDocument = Ranking & Document;

@Schema()
export class Ranking {
  @Prop({ type: Types.ObjectId, ref: 'Event' })
  event: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: string;

  @Prop()
  points: number;
}

export const RankingSchema = SchemaFactory.createForClass(Ranking);
