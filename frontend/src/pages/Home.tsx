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
      <section className="welcome jumbotron">
        <h1 className="display-4">Bem-vindos!!</h1>
        <p className="lead">
          Este é um blog criado como forma de estudo pessoal.
        </p>
        <hr className="my-4" />
        <p>
          O leitor pode ver e comentar em qualquer artigo, além de poder alterar o tema do site. Se ele preferir, pode cadastrar-se na plataforma. Logo na home, também há a opção dele poder filtrar os artigos que deseja ver, selecionando a(s) categoria(s) disponível(is) e ordenando por "Mais recentes" ou "Mais acessados".
        </p>
        <p>
          O autor, que também é admin, pode criar e deletar artigos, cadastrar e desativar autores e também poder remover comentários de algum artigo.
        </p>
        <p>
          Os artigos são formados por: título, descrição e categoria(s). A imagem principal é escolhida de acordo com o autor, sendo que ele pode deixar em branco. As categorias podem ser selecionadas e criadas no momento da criação do artigo. A descrição do artigo pode conter elementos HTML, imagens, links, além de modificar o tamanho da fonte.
        </p>
        <p>
          Os comentários feitos nos artigos são formados por: nome e descrição. O nome, por sua vez, pode ficar em branco, sinalizando que o leitor efetuou um comentário como anônimo.
        </p>
        <p>Abaixo, temos alguns exemplos de artigos.</p>
      </section>

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

      <section className="post">
        {articles?.map(article => (
          <article className="post__highlight" key={article.id}>
            <div className="post__highlight-item">
              <Tag list={article.category} />
              <h3>{article.title}</h3>
              <small>{article.author.name.split(' ')[0]}, {format(parseISO(article.publishedIn), "dd 'de' MMM", { locale: ptBR })}</small>
              <p className="text" dangerouslySetInnerHTML={{ __html: article.description }} />
              <Link to={`/articles/${article.id}`} className="btn btn__navy stretched-link" onClick={() => window.scrollTo({ top: 0 })}>
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
