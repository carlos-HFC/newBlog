import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { CategoryController } from './category.controller';
import { Category } from './category.model';
import { CategoryService } from './category.service';
import { CategoryArticleModule } from 'src/categoryArticle/categoryArticle.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forFeature([Category]),
    CategoryArticleModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule { }
