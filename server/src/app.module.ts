import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PostModule,
    MongooseModule.forRoot('mongodb://localhost:27017/mirage'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
