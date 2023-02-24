import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  picture: string;

  @Prop()
  roles: Role[];

  @Prop({ type: [Types.ObjectId], ref: 'Event' })
  events: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
