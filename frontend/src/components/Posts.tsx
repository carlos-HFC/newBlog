import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { FC, useEffect } from "react"
import { useParams } from "react-router-dom"

import { IArticles } from "../@types"
import api from "../services/api"

interface IPost {
  articles: IArticles[]
}

const Posts: FC<IPost> = ({ articles }) => {
  const params = useParams() as { id: string }

  useEffect(() => {
    api.patch(`/articles/access/${params.id}`)
  }, [])

  return (
    <>
      {articles?.map(article => article.id === Number(params.id) && (
        <article className="article">
          {article.image &&
            <div className="article__img">
              <img src={article.image} alt="Imagem do artigo" />
            </div>
          }
          <h2>{article.title}</h2>
          <ul>
            {article.category.map(item => <li key={item.id} className="badge">{item.name}</li>)}
          </ul>
          <p className="article__meta">
            {format(parseISO(String(article.publishedIn)), "dd 'de' MMM 'de' yyyy", { locale: ptBR })} por {article.author.name}
          </p>
          <p dangerouslySetInnerHTML={{ __html: String(article.description) }} />
        </article>
      ))}
    </>
  )
}

export default Posts
