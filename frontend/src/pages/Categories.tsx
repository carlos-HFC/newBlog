import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { ICategories } from '../@types'
import { Page } from '../components'
import api from '../services/api'

interface ICategoriesProps {
  categories: ICategories[]
}

export default function Categories({ categories }: ICategoriesProps) {
  const params = useParams() as unknown as ICategories

  const [category, setCategory] = useState<ICategories>()

  useEffect(() => {
    const filterCategory = categories?.find(el => el.name === params.name)
    setCategory(filterCategory)
  }, [categories, params])

  return (
    <Page title={params.name}>
      <div className="post">
        {category?.article.map(article => (
          <div className="post__highlight" key={article.id}>
            <div className="post__highlight-item">
              <h3>{article.title}</h3>
              <div>{format(parseISO(article.publishedIn), "dd 'de' MMM", { locale: ptBR })}</div>
              <p>{article.description}</p>
              <Link to="" className="stretched-link">Continue lendo</Link>
            </div>
            <div className="post__highlight-img">
              <img src={article.image} alt="Imagem do artigo" />
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}
