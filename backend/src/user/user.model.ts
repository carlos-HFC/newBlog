import { compare, hash } from 'bcrypt'
import { Op as $ } from "sequelize";
import { BeforeSave, Column, DataType, HasMany, Model, Scopes, Table } from "sequelize-typescript";

import { Article } from "src/article/article.model";

@Scopes(() => ({
  inactives: {
    paranoid: false,
    attributes: { exclude: ['hash'] },
    where: {
      deletedAt: { [$.not]: null }
    }
  },
}))
@Table({ paranoid: true })
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  nickname: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string

  @Column(DataType.VIRTUAL)
  password: string

  @Column(DataType.STRING)
  hash: string

  @Column(DataType.STRING)
  avatar: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  role: string

  @HasMany(() => Article)
  articles: Article[]

  @BeforeSave
  static async hashPass(user: User) {
    if (user.password) return user.hash = await hash(user.password, 10)
  }

  checkPass(pass: string) {
    return compare(pass, this.hash)
  }
}