import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize'
import { ServeStaticModule } from '@nestjs/serve-static';
import { SeederModule } from 'nestjs-sequelize-seeder'
import { join, resolve } from 'path';
import { Dialect } from 'sequelize'

import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CategoryArticleModule } from './categoryArticle/categoryArticle.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    SeederModule.forRoot({
      runOnlyIfTableIsEmpty: true
    }),
    MulterModule.register({
      dest: resolve(__dirname, '..', 'uploads'),
    }),
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      port: Number(process.env.DB_PORT),
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      autoLoadModels: true,
      synchronize: true
    }),
    UserModule,
    AuthModule,
    CommentModule,
    CategoryArticleModule,
    CategoryModule,
    ArticleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }