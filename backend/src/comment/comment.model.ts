import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

import { Article } from "src/article/article.model";
import { User } from "src/user/user.model";

@Table({ paranoid: true })
export class Comment extends Model<Comment> {
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  name: string

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  content: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  publishedIn: string

  @ForeignKey(() => Article)
  @Column({ allowNull: false })
  articleId: number

  @BelongsTo(() => Article)
  article: Article

  @ForeignKey(() => User)
  @Column({ allowNull: true })
  userId: number

  @BelongsTo(() => User)
  user: User
}