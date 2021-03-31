import { BeforeSave, BelongsTo, BelongsToMany, Column, DataType, DefaultScope, ForeignKey, HasMany, Model, Scopes, Table } from "sequelize-typescript";

import { Category } from "src/category/category.model";
import { CategoryArticle } from "src/categoryArticle/categoryArticle.model";
import { Comment } from "src/comment/comment.model";
import { User } from "src/user/user.model";

@DefaultScope(() => ({
  attributes: {
    exclude: ["CategoryArticle"]
  },
  include: [
    {
      model: User,
      attributes: ['id', 'name'],
      as: 'author'
    },
  ]
}))
@Scopes(() => ({
  complete: {
    include: [
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'author'
      },
      {
        model: Category,
        attributes: ['id', 'name'],
        as: 'category'
      },
      {
        model: Comment,
        attributes: ['id', 'name', 'content', 'publishedIn'],
        as: 'comment',
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
            as: 'user'
          },
        ]
      },
    ]
  }
}))
@Table({ paranoid: true })
export class Article extends Model<Article> {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  image: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  title: string

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description: string

  @Column(DataType.STRING)
  slug: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  publishedIn: string

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  authorId: number

  @BelongsTo(() => User)
  author: User

  @BelongsToMany(() => Category, {
    through: () => CategoryArticle,
    onDelete: 'CASCADE'
  })
  category: Category[]

  @HasMany(() => Comment)
  comment: Comment[]

  @BeforeSave
  static async createSlug(article: Article) {
    return article.slug = article.title.split(' ').join('_').toLowerCase()
  }
}