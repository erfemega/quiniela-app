import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContenderDocument = Contender & Document;

@Schema()
export class Contender {
  @Prop()
  name: string;

  @Prop()
  mainText: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const ContenderSchema = SchemaFactory.createForClass(Contender);
