import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useContext, useEffect } from 'react'
import { BsArrowRight } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import { Page } from '../components'
import { BlogContext } from '../context/BlogContext'
import api from '../services/api'

export default function Home() {
  const { articles, handleArticles, handleCategories } = useContext(BlogContext)

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/articles')
    ]).then(response => {
      handleCategories(response[0].data)
      handleArticles(response[1].data)
    })
  }, [])


  return (
    <Page>
      <section className="post">
        {articles?.map(article => (
          <article className="post__highlight" key={article.id}>
            <div className="post__highlight-item">
              <ul>
                {article.category.map(el => <li key={el.id} className="badge">{el.name}</li>)}
              </ul>
              <h3>{article.title}</h3>
              <small>{article.author.name.split(' ')[0]}, {format(parseISO(article.publishedIn), "dd 'de' MMM", { locale: ptBR })}</small>
              <p className="text" dangerouslySetInnerHTML={{ __html: article.description }} />
              <Link to={`/articles/${article.id}`} className="btn btn__navy stretched-link">
                Continue Lendo <BsArrowRight size={25} />
              </Link>
            </div>
            {article.image &&
              <div className="post__highlight-img">
                <img src={article.image} alt="Imagem" />
              </div>}
          </article>
        ))}
      </section>
    </Page>
  )
}
