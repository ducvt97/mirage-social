import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Post } from './post.shema';
import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsNotEmpty()
  password: string;

  @Prop({
    default:
      'https://www.shutterstock.com/image-vector/male-avatar-profile-picture-use-600nw-193292036.jpg',
  })
  avatar: string;

  @Prop({ required: true })
  @IsNotEmpty()
  firstName: string;

  @Prop({ required: true })
  @IsNotEmpty()
  lastName: string;

  @Prop()
  @IsDateString()
  dob: string;

  @Prop({
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  friends: User[];

  @Prop({
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  })
  posts: Post[];
}

export const UserSchema = SchemaFactory.createForClass(User);
