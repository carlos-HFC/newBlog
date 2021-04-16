import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { format } from 'date-fns'

import { ICreateArticle } from "src/@types";
import { CategoryService } from "src/category/category.service";
import { CategoryArticleService } from "src/categoryArticle/categoryArticle.service";
import { Article } from "./article.model";

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article)
    private readonly articleModel: typeof Article,
    private categoryService: CategoryService,
    private categoryArticleService: CategoryArticleService
  ) { }

  async getAll() {
    return await this.articleModel.scope("complete").findAll({
      order: [
        ['numberAccess', 'DESC'],
        ['comment', 'id', 'DESC']
      ]
    })
  }

  async latestArticles() {
    return await this.articleModel.scope("complete").findAll({
      order: [
        ['id', 'DESC'],
        ['comment', 'id', 'DESC']
      ],
      limit: 5
    })
  }

  async getById(id: number) {
    return await this.articleModel.scope("complete").findByPk(id)
  }

  async registerAccess(id: number) {
    const article = await this.getById(id)

    return await article.update({ numberAccess: article.numberAccess + 1 })
  }

  async store(authorId: number, body: ICreateArticle, file?: Express.Multer.File) {
    const { categoriesId } = body

    const convertCategoriesId = categoriesId.split(',').map(item => Number(item.trim()))

    const categories = await Promise.all(
      convertCategoriesId.map(ids => this.categoryService.getById(Number(ids)))
    )

    if (categories.some(category => category === null)) throw new HttpException("Categoria não encontrada!", 404)

    const publishedIn = format(new Date(), 'yyyy-MM-dd')

    const article = await this.articleModel.create({
      ...body,
      authorId,
      publishedIn,
      image: file && `http://localhost:8000/uploads/${file.filename}`
    })

    await Promise.all(
      categories.map(category => this.categoryArticleService.store({
        articleId: article.id,
        categoryId: category.id
      }))
    )

    return { article, message: "Artigo criado com sucesso!" }
  }

  async update(id: number, body: ICreateArticle, file: Express.Multer.File) {
    const { categoriesId } = body

    const convertCategoriesId = categoriesId?.split(',').map(item => Number(item.trim()))

    const article = await this.getById(id)
    const categories = convertCategoriesId?.map(ids => ids)

    if (!article) throw new HttpException("Artigo não encontrado!", 404)

    const ids = categories && await Promise.all(
      categories.map(item => this.categoryService.getById(Number(item)))
    )

    if (ids?.length) {
      if (ids?.some(category => category === null)) throw new HttpException("Categoria não encontrada!", 404)

      const withoutArticle = ids?.filter(category => !category.article.length)
      if (withoutArticle.length) {
        await Promise.all(
          withoutArticle.map(item => this.categoryArticleService.store({
            articleId: id,
            categoryId: item.id
          }))
        )
      }

      const withArticle = article.category.filter(el => !categoriesId.includes(el.id))
      if (withArticle.length) {
        const [catArt] = await Promise.all(
          withArticle.map(item => this.categoryArticleService.getByCategoryId(item.id))
        )

        await Promise.all(
          catArt.map(el => this.categoryArticleService.delete(el.id))
        )
      }
    }

    await article.update({
      ...body,
      image: file && `http://localhost:8000/uploads/${file?.filename}`
    })

    return { message: "Artigo editado com sucesso!" }
  }

  async delete(id: number) {
    const article = await this.getById(id)

    if (!article) throw new HttpException("Artigo não encontrado!", 404)

    const categoryArticle = await this.categoryArticleService.getByArticleId(id)

    await Promise.all([
      article.destroy(),
      categoryArticle.map(el => this.categoryArticleService.delete(el.id))
    ])

    return { message: "Artigo deletado com sucesso!" }
  }
}