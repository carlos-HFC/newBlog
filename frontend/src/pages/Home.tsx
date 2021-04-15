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
  const { articles, categories, handleArticles, handleCategories } = useContext(BlogContext)

  const [filter, setFilter] = useState(false)
  const [ids, setIds] = useState<IOptions[]>([])
  const [order, setOrder] = useState('numberAccess')

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/articles')
    ]).then(response => {
      handleCategories(response[0].data)
      handleArticles(response[1].data)
    })
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
        {articles?.map(article => (
          <article className="detach__highlight" key={article.id}>
            <div className="detach__highlight-item">
              <Tag list={article.category} />
              <h3>{article.title}</h3>
              <small>{article.author.name.split(' ')[0]}, {format(parseISO(article.publishedIn), "dd 'de' MMM", { locale: ptBR })}</small>
              <p className="text" dangerouslySetInnerHTML={{ __html: article.description.substring(0, 200) }} />
              <Link to={`/articles/${article.id}`} className="btn btn__navy stretched-link" onClick={() => window.scrollTo({ top: 0 })}>
                Continue Lendo <BsArrowRight size={25} />
              </Link>
            </div>
            {article.image &&
              <div className="detach__highlight-img">
                <img src={article.image} alt="Imagem" />
              </div>}
          </article>
        ))}
        {articles?.map(article => (
          <article className="detach__highlight" key={article.id}>
            <div className="detach__highlight-item">
              <Tag list={article.category} />
              <h3>{article.title}</h3>
              <small>{article.author.name.split(' ')[0]}, {format(parseISO(article.publishedIn), "dd 'de' MMM", { locale: ptBR })}</small>
              <p className="text" dangerouslySetInnerHTML={{ __html: article.description.substring(0, 200) }} />
              <Link to={`/articles/${article.id}`} className="btn btn__navy stretched-link" onClick={() => window.scrollTo({ top: 0 })}>
                Continue Lendo <BsArrowRight size={25} />
              </Link>
            </div>
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
            {[1, 2, 3, 4].map(() => (
              <article className="post__highlight">
                <div className="post__highlight-img">
                  <img src={articles && articles[0]?.image} alt="" />
                </div>
                <Link to="" className="post__highlight-item stretched-link">
                  <header>
                    <ul className="tag">
                      <li>Tag</li>
                    </ul>
                    <small>Autor</small>
                  </header>
                  <h3>Título</h3>
                  <p className="text" dangerouslySetInnerHTML={{ __html: articles && articles[0].description.substring(0, 200) }} />
                </Link>
              </article>
            ))}
          </section>
        </div>

        <div className="col-lg-3">
          <section className="related">
            <h2>Últimos textos</h2><hr />
            {[1, 2, 3, 4, 5].map(() => (
              <p>Title Title Title</p>
            ))}
          </section>
        </div>
      </div>
    </Page>
  )
}