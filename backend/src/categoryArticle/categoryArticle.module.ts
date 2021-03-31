import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { ArticleModule } from 'src/article/article.module';
import { CategoryModule } from 'src/category/category.module';
import { CategoryArticleController } from './categoryArticle.controller';
import { CategoryArticle } from './categoryArticle.model';
import { CategoryArticleService } from './categoryArticle.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forFeature([CategoryArticle]),
    forwardRef(() => ArticleModule),
    forwardRef(() => CategoryModule),
  ],
  controllers: [CategoryArticleController],
  providers: [CategoryArticleService],
  exports: [CategoryArticleService]
})
export class CategoryArticleModule { }
