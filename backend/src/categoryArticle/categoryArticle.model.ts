import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

import { Article } from "src/article/article.model";
import { Category } from "src/category/category.model";

@Table({ paranoid: true })
export class CategoryArticle extends Model<CategoryArticle> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @ForeignKey(() => Category)
  @Column({
    onDelete: 'CASCADE'
  })
  categoryId: number

  @ForeignKey(() => Article)
  @Column({
    onDelete: 'CASCADE'
  })
  articleId: number
}