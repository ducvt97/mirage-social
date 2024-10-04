import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Post } from './post.shema';
import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { handleError } from 'src/utils/response.util';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema(
  // { timestamps: true }
)
export class User {
  _id: mongoose.Schema.Types.ObjectId;

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

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

UserSchema.pre('save', async function (next: Function) {
  try {
    console.log('sdfbsfdb');
    
    const user = this;

    const hashPassword = await bcrypt.hash(
      user.password,
      process.env.SALT || 10,
    );
    if (!hashPassword) {
      throw 'Something went wrong. Please try again.';
    }
    user.password = hashPassword;
    next();
  } catch (error) {
    handleError({}, 404, error);
  }
});
