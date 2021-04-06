import { forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { ICreateCategoryArticle } from "src/@types";
import { Article } from "src/article/article.model";
import { ArticleService } from "src/article/article.service";
import { Category } from "src/category/category.model";
import { CategoryService } from "src/category/category.service";
import { CategoryArticle } from "./categoryArticle.model";

@Injectable()
export class CategoryArticleService {
  constructor(
    @InjectModel(CategoryArticle)
    private readonly categoryArticleModel: typeof CategoryArticle,
    @Inject(forwardRef(() => ArticleService))
    private articleService: ArticleService,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) { }

  async getAll() {
    return await this.categoryArticleModel.findAll()
  }

  async filterArticles(ids?: string, field: 'numberAccess' | 'publishedIn' = 'numberAccess') {
    let where = {}

    if (ids) where = { categoryId: ids.split(',') }

    return await this.categoryArticleModel.findAll({
      where,
      include: [
        {
          model: Article,
          include: [Category]
        }
      ],
      order: [['article', field, 'DESC']]
    })
  }

  async getById(id: number) {
    return await this.categoryArticleModel.findByPk(id)
  }

  async getByCategoryId(categoryId: number) {
    return await this.categoryArticleModel.findAll({ where: { categoryId } })
  }

  async getByArticleId(articleId: number) {
    return await this.categoryArticleModel.findAll({ where: { articleId } })
  }

  async store(body: ICreateCategoryArticle) {
    const { categoryId, articleId } = body

    const [category, article] = await Promise.all([
      this.categoryService.getById(categoryId),
      this.articleService.getById(articleId),
    ])

    if (!category) throw new HttpException("Categoria não encontrada!", 404)
    if (!article) throw new HttpException("Artigo não encontrado!", 404)

    const categoryArticle = await this.categoryArticleModel.create({
      categoryId,
      articleId
    })

    return { categoryArticle }
  }

  async update(id: number, body: ICreateCategoryArticle) {
    const [categoryArticle, category, article] = await Promise.all([
      this.getById(id),
      this.categoryService.getById(body.categoryId),
      this.articleService.getById(body.articleId),
    ])

    if (!categoryArticle) throw new HttpException("Nâo encontrado!", 404)
    if (!category) throw new HttpException("Categoria não encontrada!", 404)
    if (!article) throw new HttpException("Artigo não encontrado!", 404)

    await categoryArticle.update(body)

    return { categoryArticle, category, article }
  }

  async delete(id: number) {
    const categoryArticle = await this.getById(id)

    if (!categoryArticle) throw new HttpException("Nâo encontrado!", 404)

    await categoryArticle.destroy()
  }
}