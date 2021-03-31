import 'express'
import { User } from 'src/user/user.model';

declare module 'express' {
  export interface Request {
    user: User
  }
}

export interface ICreateUser extends User {
  confirmPass: string
}

export interface IUpdateUser {
  avatar?: string
  name?: string
  email?: string
  nickname?: string
  password?: string
  oldPass?: string
  confirmPass?: string
}

export interface ILogin {
  username: string
  password: string
}

export interface ICreateCategory {
  name: string
}

export interface ICreateArticle {
  title: string
  description: string
  categoriesId: string
}

export interface ICreateComment {
  name?: string
  isAnonimous: boolean
  content: string
  articleId: number
}

export interface ICreateCategoryArticle {
  categoryId: number
  articleId: number
}