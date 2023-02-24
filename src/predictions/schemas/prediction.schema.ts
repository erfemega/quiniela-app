import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Status } from '../enums/status.enum';

export type PredictionDocument = Prediction & Document;

@Schema()
export class Prediction {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: string;

  @Prop({ type: Types.ObjectId, ref: 'Contender' })
  winner: string;

  @Prop({ default: Status.Pending })
  status: Status;

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  event: string;

  @Prop({ type: Types.ObjectId, ref: 'Match' })
  match: string;
}

export const PredictionSchema = SchemaFactory.createForClass(Prediction);
