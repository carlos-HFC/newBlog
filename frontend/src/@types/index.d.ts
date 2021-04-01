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
  deletedAt: Date | null
}

export interface IComments {
  id: number
  userId?: number
  name?: string
  content: string
  publishedIn: string
  user?: IUser
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