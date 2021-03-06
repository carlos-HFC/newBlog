import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

import { ICreateArticle } from "src/@types";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Role } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/role.guard";
import { ArticleService } from "./article.service";
import multerConfig from '../multer'

@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService
  ) { }

  @Get()
  async index() {
    return await this.articleService.getAll()
  }

  @Get('/latest')
  async latest() {
    return await this.articleService.latestArticles()
  }

  @Get(':id')
  async getId(@Param('id') id: number) {
    return await this.articleService.getById(id)
  }

  @Patch('/access/:id')
  async access(@Param('id') id: number) {
    return await this.articleService.registerAccess(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('author')
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async store(@Body() body: ICreateArticle, @Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return await this.articleService.store(req.user.id, body, file)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('author')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async update(@Body() body: ICreateArticle, @Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return await this.articleService.update(id, body, file)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('author')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.articleService.delete(id)
  }

}