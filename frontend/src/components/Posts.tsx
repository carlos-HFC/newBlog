import { format, formatDistance, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChangeEvent, FC, FormEvent, Fragment, useContext, useEffect, useState } from "react"
import { BsPerson } from "react-icons/bs"
import { useParams } from "react-router-dom"

import { Button, InputBlock, Tag } from "."
import { IArticles } from "../@types"
import { BlogContext } from "../context/BlogContext"
import { notify } from "../utils"
import api from "../services/api"

interface IPost {
  articles: IArticles[]
}

const Posts: FC<IPost> = ({ articles }) => {
  const params = useParams() as { id: string }
  const { handleArticles } = useContext(BlogContext)

  const [comment, setComment] = useState({
    name: "",
    content: ""
  })

  useEffect(() => {
    api.patch(`/articles/access/${params.id}`)
  }, [])

  function changeFormComment(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setComment({ ...comment, [e.target.name]: e.target.value })
  }

  function cancelComment() {
    setComment({ name: "", content: "" })
  }

  async function sendComment(e: FormEvent) {
    e.preventDefault()

    const { name, content } = comment

    if (!content) return notify('error', 'Preencha o comentário, por favor!', 'danger')

    try {
      const response = await api.post('/comments', {
        content,
        name,
        isAnonimous: !name,
        articleId: params.id
      })

      notify('success', response.data.message, 'success')
      cancelComment()
      api.get('/articles').then(response => handleArticles(response.data))
    } catch (error) {
      return notify('error', error.response.data.message, 'danger')
    }
  }

  return (
    <>
      {articles?.map(article => article.id === Number(params.id) && (
        <Fragment key={article.id}>
          <article className="article">
            {article.image &&
              <div className="article__img">
                <img src={article.image} alt="Imagem do artigo" />
              </div>}
            <h2>{article.title}</h2>
            <Tag list={article.category} />
            <p className="article__meta">
              {format(parseISO(String(article.publishedIn)), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} por {article.author.name}
            </p>
            <p dangerouslySetInnerHTML={{ __html: String(article.description) }} />
          </article>

          <form className="form__comments" onSubmit={sendComment}>
            <h4>Comentários</h4><hr />
            <InputBlock id="NameCommentArticle" label="Nome" name="name" value={comment.name} onChange={changeFormComment} />
            <InputBlock id="ContentCommentArticle" label="Comentário" type="textarea" name="content" value={comment.content} onChange={changeFormComment} required />
            <div className="d-flex justify-content-end">
              <Button type="submit" variant="success">
                Enviar
              </Button>
              <Button type="reset" variant="secondary" className="ml-2" onClick={cancelComment}>
                Cancelar
              </Button>
            </div>
          </form>

          {article.comment?.map(comment => (
            <div className="comments" key={comment.id}>
              <strong>
                <BsPerson size={18} /> {comment.name || "Anônimo"}
                <time>Há {formatDistance(parseISO(comment.publishedIn), new Date(), { locale: ptBR })}</time>
              </strong>
              <p>{comment.content}</p>
            </div>
          ))}
        </Fragment>
      ))}
    </>
  )
}

export default Posts
