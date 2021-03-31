import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { resolve } from 'path';

import { ArticleController } from './article.controller';
import { Article } from './article.model';
import { ArticleService } from './article.service';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';
import { CategoryArticleModule } from 'src/categoryArticle/categoryArticle.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Article]),
    UserModule,
    CategoryModule,
    CategoryArticleModule,
    MulterModule.register({
      dest: resolve(__dirname, '..', '..', 'uploads')
    }),
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET
    })
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService]
})
export class ArticleModule { }
