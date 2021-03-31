import { createContext, ReactNode, useState } from "react";

import { IArticles, ICategories } from '../@types'

interface BlogContextProps {
  categories: ICategories[]
  articles: IArticles[]
  handleArticles: (articles: IArticles[]) => void
  handleCategories: (categories: ICategories[]) => void
}

interface BlogProviderProps {
  children: ReactNode
  categories: ICategories[]
  articles: IArticles[]
}

export const BlogContext = createContext({} as BlogContextProps)

export function BlogProvider({ children, ...rest }: BlogProviderProps) {
  const [articles, setArticles] = useState(rest.articles)
  const [categories, setCategories] = useState(rest.categories)

  function handleArticles(articles: IArticles[]) {
    setArticles(articles)
  }
  function handleCategories(categories: ICategories[]) {
    setCategories(categories)
  }

  return (
    <BlogContext.Provider value={{ articles, categories, handleArticles, handleCategories }}>
      {children}
    </BlogContext.Provider>
  )
}