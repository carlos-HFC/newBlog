import "styled-components"

declare module "styled-components" {
  export interface DefaultTheme {
    background: string
    primary: string
    title: string
    shadow: string
    text: string
    profile: string
    profileList: string
    inputBg: string
  }
}

export interface IUser {
  id: number
  name: string
  nickname: string
  email: string
  avatar?: string
  role: string
  createdAt: Date
  deletedAt: Date | null
}

export interface IComments {
  id: number
  name?: string
  content: string
  publishedIn: string
}

export interface IArticles {
  id: number
  authorId: number
  title: string
  description: string
  slug: string
  image?: string
  numberAccess: number
  publishedIn: string
  author: IUser
  comment: IComments[]
  category: ICategories[]
}

export interface ICategories {
  id: number
  name: string
  article: IArticles[]
}

export interface IOptions {
  value: string | number
  label: string
  __isNew__?: boolean
}