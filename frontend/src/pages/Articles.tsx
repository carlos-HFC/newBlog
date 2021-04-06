import { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { BsCamera } from 'react-icons/bs'
import Creatable from 'react-select/creatable'
import Quill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { IOptions } from '../@types'
import { Button, InputBlock, Page } from '../components'
import { BlogContext } from '../context/BlogContext'
import { notify } from '../utils'
import api from '../services/api'
import withPermission from '../utils/util'

function Articles() {
  const { categories } = useContext(BlogContext)

  const [newTags, setNewTags] = useState<IOptions[]>([])
  const [thumb, setThumb] = useState<File | null>(null)
  const [registerArticleData, setRegisterArticleData] = useState({
    title: "",
    description: ""
  })

  const { getInputProps, getRootProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptFiles) => {
      const file = acceptFiles[0]
      setThumb(file)
    }
  })

  function changeRegisterArticle(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setRegisterArticleData({ ...registerArticleData, [e.target.name]: e.target.value })
  }

  function cancelRegisterArticle() {
    setRegisterArticleData({ title: "", description: "" })
    setThumb(null)
    setNewTags([])
  }

  async function registerArticle(e: FormEvent) {
    e.preventDefault()

    if (Object.values(registerArticleData).some(el => !el) || !newTags.length) {
      return notify('error', 'Preencha todos os campos', 'danger')
    }

    const oldCategories = newTags.filter(el => !el.__isNew__).map(el => el.value)
    const newCategories = newTags.filter(el => el.__isNew__)

    try {
      const categories = await Promise.all(
        newCategories.map(el => api.post('/categories', { name: el.label }))
      )

      const categoriesId = [...oldCategories, ...categories.map(el => el.data.category.id)]

      const data = new FormData()
      if (thumb) data.append('file', thumb as any, thumb?.name)
      data.append('title', registerArticleData.title)
      data.append('description', registerArticleData.description)
      data.append('categoriesId', categoriesId.toString())

      const response = await api.post('/articles', data)

      if (response.status === 201) notify('success', response.data.message, 'success')

      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      return notify('error', error.response.data.message, 'danger')
    }
  }

  return (
    <Page title="Cadastrar Artigo">
      <form onSubmit={registerArticle}>
        <div className="row mb-3">
          <div className="col">
            <div {...getRootProps()} className={`dropzone ${thumb ? 'has-thumbnail' : ''}`}>
              <input {...getInputProps()} accept="image/*" />
              {thumb
                ? <img src={URL.createObjectURL(thumb)} alt="Ponto de coleta" />
                : (
                  <p>
                    <BsCamera />
                    Clique aqui ou arraste o arquivo
                  </p>
                )}
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-lg-6">
            <InputBlock id="TitleArticle" label="Título" name="title" placeholder="Adicione o título do artigo"
              value={registerArticleData.title} onChange={changeRegisterArticle} />
          </div>
          <div className="col-lg-6">
            <label>Categorias</label>
            <Creatable classNamePrefix="react_select" isMulti isLoading={!categories?.length} isClearable placeholder="Adicione a(s) categoria(s) do artigo"
              options={categories?.map(el => ({ value: el.id, label: el.name }))}
              value={newTags as any} onChange={e => setNewTags(e as any)}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col mb-2">
            <label htmlFor="Description">Descrição</label>
            <Quill id="Description" value={registerArticleData.description} onChange={description => setRegisterArticleData({ ...registerArticleData, description })}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'blockquote', 'code-block'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                  [{ 'align': [] }],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <Button type="submit" variant="primary" className="mr-2">
            Cadastrar
          </Button>
          <Button type="reset" variant="secondary" onClick={cancelRegisterArticle}>
            Cancelar
          </Button>
        </div>
      </form>
    </Page>
  )
}

export default withPermission(['author'])(Articles)