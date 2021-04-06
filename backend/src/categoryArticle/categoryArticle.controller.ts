import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ICreateCategoryArticle } from "src/@types";

import { CategoryArticleService } from "./categoryArticle.service";

@Controller('categoryArticles')
export class CategoryArticleController {
  constructor(
    private categoryArticleService: CategoryArticleService
  ) { }

  @Get()
  async index() {
    return await this.categoryArticleService.getAll()
  }

  @Get('/filter')
  async filter(@Query('ids') ids?: string, @Query("field") field?: 'numberAccess' | 'publishedIn') {
    return await this.categoryArticleService.filterArticles(ids, field)
  }

  @Get(":id")
  async byId(@Param("id") id: number) {
    return await this.categoryArticleService.getById(id)
  }

  @Get("/category/:categoryId")
  async byCategoryId(@Param("categoryId") categoryId: number) {
    return await this.categoryArticleService.getByCategoryId(categoryId)
  }

  @Get("/article/:articleId")
  async byArticleId(@Param("articleId") articleId: number) {
    return await this.categoryArticleService.getByArticleId(articleId)
  }

  @Post()
  async store(@Body() body: ICreateCategoryArticle) {
    return await this.categoryArticleService.store(body)
  }

  @Patch(":id")
  async update(@Body() body: ICreateCategoryArticle, @Param("id") id: number) {
    return await this.categoryArticleService.update(id, body)
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    return await this.categoryArticleService.delete(id)
  }
}