import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document, Types } from 'mongoose';
import { Match } from 'src/matches/schemas/match.schema';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [Types.ObjectId], ref: 'Match' })
  matches: Match[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
