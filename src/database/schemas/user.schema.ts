import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as schema } from 'mongoose';
import { Role } from './role.schema';
import { Posts } from './post.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: number;

  @Prop({ type: 'String', unique: true })
  email: string;

  @Prop({
    type: 'String',
    required: true,
  })
  password: string;

  @Prop({ type: 'String' })
  firstName: string;

  @Prop({ type: 'String' })
  lastName: string;

  @Prop({ type: 'String' })
  phone: string;

  @Prop({ type: 'String' })
  userProfile: string;

  @Prop({ type: 'String', enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: [{ type: schema.Types.ObjectId, ref: 'Post' }] })
  posts: Posts[];

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
