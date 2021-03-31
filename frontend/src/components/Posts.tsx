import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { FC } from "react"

import { IArticles } from "../@types"

interface IPost {
  article: IArticles
}

const Posts: FC<IPost> = ({ article }) => {
  return (
    <article className="blog__post">
      <h2 className="blog__post-title">
        {article.title}
      </h2>
      <p className="blog__post-meta">
        {format(parseISO(article.publishedIn), "dd 'de' MMM 'de' yyyy", { locale: ptBR })} por {article.author.name}
      </p>
      <p>
        {article.description}
      </p>
    </article>
  )
}

export default Posts
