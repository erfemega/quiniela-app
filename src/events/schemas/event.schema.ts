import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MatchDocument } from 'src/matches/schemas/match.schema';
import { UserDocument } from 'src/users/schemas/user.schema';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [Types.ObjectId], ref: 'Match' })
  matches: MatchDocument[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owners: UserDocument[];

  @Prop({ default: false })
  published: boolean;

  @Prop({ default: false })
  default: boolean;

  @Prop()
  finishDate: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
