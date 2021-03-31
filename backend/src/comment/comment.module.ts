import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize';

import { ArticleModule } from 'src/article/article.module';
import { UserModule } from 'src/user/user.module';
import { CommentController } from './comment.controller';
import { Comment } from './comment.model';
import { CommentService } from './comment.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forFeature([Comment]),
    UserModule,
    ArticleModule
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule { }