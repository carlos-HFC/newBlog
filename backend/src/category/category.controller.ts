import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { ICreateCategory } from "src/@types";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/role.guard";
import { Role } from "src/auth/roles.decorator";
import { CategoryService } from "./category.service";

@Controller('categories')
export class CategoryController {
  constructor(
    private categoryService: CategoryService
  ) { }

  @Get()
  async index() {
    return await this.categoryService.getAll()
  }

  @Get(':id')
  async getId(@Param('id') id: number) {
    return await this.categoryService.getById(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('author')
  @Post()
  async store(@Body() body: ICreateCategory) {
    return await this.categoryService.store(body)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('author')
  @Patch(':id')
  async update(@Body() body: ICreateCategory, @Param('id') id: number) {
    return await this.categoryService.update(id, body)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('author')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.categoryService.delete(id)
  }
}