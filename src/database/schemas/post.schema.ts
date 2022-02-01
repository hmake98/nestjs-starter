import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as schema } from 'mongoose';
import { User } from './user.schema';

export type PostDocument = Posts & Document;

@Schema()
export class Posts {
  @Prop()
  id: number;

  @Prop({ type: 'String', unique: true })
  content: string;

  @Prop({ type: 'String' })
  firstName: string;

  @Prop({ type: schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now() })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Posts);
