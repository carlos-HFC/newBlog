import { BelongsToMany, Column, DataType, DefaultScope, Model, Scopes, Table } from "sequelize-typescript";

import { Article } from "src/article/article.model";
import { CategoryArticle } from "src/categoryArticle/categoryArticle.model";
import { User } from "src/user/user.model";

@DefaultScope(() => ({
  attributes: {
    exclude: ["CategoryArticle"]
  }
}))
@Scopes(() => ({
  articles: {
    include: [
      {
        model: Article,
        as: 'article',
        include: [
          {
            model: User,
            attributes: ['id', 'name'],
            as: 'author'
          },
          {
            model: Category,
          },
        ]
      }
    ]
  }
}))
@Table({ paranoid: true })
export class Category extends Model<Category> {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string

  @BelongsToMany(() => Article, {
    through: () => CategoryArticle,
    onDelete: 'CASCADE'
  })
  article: Article[]
}