import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Match } from 'src/matches/schemas/match.schema';
import { User } from 'src/users/schemas/user.schema';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [Types.ObjectId], ref: 'Match' })
  matches: Match[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owners: User[];

  @Prop({ default: false })
  published: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
