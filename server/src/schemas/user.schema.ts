import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
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
  friends: string[];

  @Prop({
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  friendRequests: string[];

  @Prop({
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  friendRequestsSent: string[];

  @Prop({
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
  })
  conversations: string[];

  @Prop({
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
  })
  unreadConversations: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

// UserSchema.pre<UserDocument>('save', function (next: Function) {
//   const user = this;

//   if (user.isModified('password')) {
//     bcrypt.hash(user.password, 10, (err, hash) => {
//       if (err) {
//         return next(err);
//       }
//       user.password = hash;
//       next();
//     });
//   }
// });
