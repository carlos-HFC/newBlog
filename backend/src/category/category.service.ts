import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { ICreateCategory } from "src/@types";
import { CategoryArticleService } from "src/categoryArticle/categoryArticle.service";
import { Category } from "./category.model";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
    private categoryArticleService: CategoryArticleService
  ) { }

  async getAll() {
    return await this.categoryModel.scope("articles").findAll()
  }

  async getById(id: number) {
    return await this.categoryModel.scope("articles").findByPk(id)
  }

  async store(body: ICreateCategory) {
    const category = await this.categoryModel.create(body)

    return { category, message: "Categoria criada com sucesso!" }
  }

  async update(id: number, body: ICreateCategory) {
    const category = await this.getById(id)

    if (!category) throw new HttpException("Categoria não encontrada", 404)

    await category.update(body)

    return { message: "Categoria editada com sucesso!" }
  }

  async delete(id: number) {
    const category = await this.getById(id)

    if (!category) throw new HttpException("Categoria não encontrada", 404)

    const categoryArticle = await this.categoryArticleService.getByCategoryId(id)

    await Promise.all([
      category.destroy(),
      categoryArticle.map(el => this.categoryArticleService.delete(el.id))
    ])

    return { message: "Categoria deletada com sucesso!" }
  }
}