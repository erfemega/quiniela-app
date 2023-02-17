import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MatchPrediction } from './matchPrediction.schema';
import { User } from 'src/users/schemas/user.schema';

export type PredictionDocument = Prediction & Document;

@Schema()
export class Prediction {
  @Prop({ type: Types.ObjectId, ref: 'Event' })
  event: string;

  @Prop()
  predictions: MatchPrediction[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User;
}

export const PredictionSchema = SchemaFactory.createForClass(Prediction);
