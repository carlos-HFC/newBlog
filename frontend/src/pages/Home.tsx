import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useContext, useEffect, useState } from 'react'
import { Collapse } from 'react-bootstrap'
import { BsArrowRight } from 'react-icons/bs'
import { FaArrowCircleDown } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Select from 'react-select'

import { IArticles, ICategories, IOptions } from '../@types'
import { Button, Page, Tag } from '../components'
import { BlogContext } from '../context/BlogContext'
import api from '../services/api'

export default function Home() {
  const { articles, categories, handleArticles } = useContext(BlogContext)

  const [filter, setFilter] = useState(false)
  const [ids, setIds] = useState<IOptions[]>([])
  const [order, setOrder] = useState('numberAccess')
  const [latestArticles, setLatestArticles] = useState<IArticles[]>([])

  useEffect(() => {
    api.get('/articles/latest')
      .then(response => setLatestArticles(response.data))
  }, [])

  async function filterCategories() {
    const params = new URLSearchParams()

    params.append("field", order)

    if (ids.length) params.append("ids", String(ids.map(item => item.value)))

    const response = await api.get(`/categoryArticles/filter`, { params })

    const articles = response.data.map((item: ICategories) => item.article)

    const tmp = Array.from(new Set(articles.map((el: IArticles) => el.id))).map(id => articles.find((el: IArticles) => el.id === id))
    handleArticles(tmp)
  }

  function cancelFilter() {
    setIds([])
    setOrder('numberAccess')
    api.get('/articles').then(response => handleArticles(response.data))
  }

  return (
    <Page>
      <section className="filters">
        <div className="d-flex justify-content-center">
          <Button variant="primary" onClick={() => setFilter(filter => !filter)}>
            Filtrar Artigos <FaArrowCircleDown style={filter ? { transform: "rotate(180deg)" } : { transform: "rotate(0)" }} />
          </Button>
        </div>

        <Collapse in={filter} className="col">
          <div>
            <div className="row my-3">
              <div className="col-lg-8 mb-2">
                <label htmlFor="categories">Categorias</label>
                <Select id="categories" classNamePrefix="react_select" isMulti isLoading={!categories?.length} closeMenuOnSelect={false}
                  placeholder="Selecione a(s) categoria(s)"
                  options={categories?.map(item => ({ value: item.id, label: item.name }))}
                  value={ids} onChange={ids => setIds(ids as any[])}
                />
              </div>
              <div className="col-lg-4 mb-2">
                <div className="form-group">
                  <legend className="col-form-label">Ordenar</legend>
                  <div className="form-check-inline">
                    <input type="radio" name="articleOrder" id="article_access" className="form-check-input check__input"
                      value="numberAccess" checked={order === 'numberAccess'} onChange={e => setOrder(e.target.value)} />
                    <label htmlFor="article_access" className="form-check-label">Mais acessados</label>
                  </div>
                  <div className="form-check-inline">
                    <input type="radio" name="articleOrder" id="article_recent" className="form-check-input check__input"
                      value="publishedIn" checked={order === 'publishedIn'} onChange={e => setOrder(e.target.value)} />
                    <label htmlFor="article_recent" className="form-check-label">Mais recentes</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Button variant="primary" onClick={filterCategories}>
                Filtrar
              </Button>
              <Button variant="secondary" className="ml-2" onClick={cancelFilter}>
                Cancelar
              </Button>
            </div>
          </div>
        </Collapse>
      </section>

      <section className="detach">
        {articles?.slice(0, 2).map(article => (
          <article className="detach__highlight" key={article.id}>
            <Link to={`/articles/${article.id}`} className="detach__highlight-item stretched-link" onClick={() => window.scrollTo({ top: 0 })}>
              <Tag list={article.category} />
              <h3>{article.title}</h3>
              <small>{article.author.name.split(' ')[0]}, {format(parseISO(article.publishedIn), "dd 'de' MMM", { locale: ptBR })}</small>
              <p className="text" dangerouslySetInnerHTML={{ __html: article.description.substring(0, 200) }} />
              <Button variant="navy">
                Continue Lendo <BsArrowRight size={25} />
              </Button>
            </Link>
            {article.image &&
              <div className="detach__highlight-img">
                <img src={article.image} alt="Imagem" />
              </div>}
          </article>
        ))}
      </section>

      <div className="row">
        <div className="col-lg-9">
          <section className="post">
            {articles?.slice(2).map(article => (
              <article className="post__highlight" key={article.id}>
                <div className="post__highlight-img">
                  <img src={article.image} alt={article.title} />
                </div>
                <Link to={`/articles/${article.id}`} className="post__highlight-item stretched-link" onClick={() => window.scrollTo({ top: 0 })}>
                  <header>
                    <Tag list={article.category} />
                    <small>{article.author.name.split(' ')[0]}</small>
                  </header>
                  <h3>{article.title}</h3>
                  <p className="text" dangerouslySetInnerHTML={{ __html: article.description.substring(0, 200) }} />
                </Link>
              </article>
            ))}
          </section>
        </div>

        <div className="col-lg-3">
          <section className="latest">
            <h2>Últimos textos</h2><hr />
            {latestArticles.map(article => (
              <Link to={`/articles/${article.id}`}>
                {article.title}
              </Link>
            ))}
          </section>
        </div>
      </div>
    </Page>
  )
}