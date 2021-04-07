import { formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useContext, useEffect, useState } from 'react'

import { IUser } from '../@types'
import { Avatar, Button, Page } from '../components'
import { UserContext } from '../context/UserContext'
import { notify } from '../utils'
import api from '../services/api'
import withPermission from '../utils/util'

function Users() {
  const { user } = useContext(UserContext)

  const [authors, setAuthors] = useState<IUser[]>([])
  const [readers, setReaders] = useState<IUser[]>([])
  const [listActive, setListActive] = useState('author')
  const [filterUser, setFilterUser] = useState('active')

  useEffect(() => {
    Promise.all([
      api.get('/users?role=author'),
      api.get('/users?role=reader'),
    ]).then(response => {
      setAuthors(response[0].data)
      setReaders(response[1].data)
    })
  }, [])

  async function handleFilterUsers() {
    try {
      if (filterUser === 'inactive') {
        const response = await Promise.all([
          api.get('/users/inactive?role=author'),
          api.get('/users/inactive?role=reader')
        ])
        setAuthors(response[0].data)
        setReaders(response[1].data)
      } else {
        const response = await Promise.all([
          api.get('/users?role=author'),
          api.get('/users?role=reader'),
        ])
        setAuthors(response[0].data)
        setReaders(response[1].data)
      }
    } catch (error) {
      notify('error', error.response.data.message, 'danger')
    }
  }

  async function inactiveUser(user: IUser) {
    try {
      const response = await api.delete(`/users/${user.id}`)
      notify('success', response.data.message, 'success')

      const role = await api.get(`/users?role=${user.role}`)
      user.role === 'author' ? setAuthors(role.data) : setReaders(role.data)
    } catch (error) {
      notify('error', error.response.data.message, 'danger')
    }
  }

  return (
    <Page title="Usuários">
      <div className="users">
        <header>
          <strong className={listActive === 'author' ? 'active' : ''} onClick={() => setListActive('author')}>
            Autores
          </strong>
          <strong className={listActive === 'reader' ? 'active' : ''} onClick={() => setListActive('reader')}>
            Leitores
          </strong>
        </header>

        <div className="mb-5 text-center">
          <h6>Filtrar por:</h6>
          <div className="form-check-inline">
            <input type="radio" name="FilterUsers" id="UsersActive" className="form-check-input check__input"
              value="active" checked={filterUser === 'active'} onChange={e => setFilterUser(e.target.value)} />
            <label htmlFor="UsersActive" className="form-check-label check__label">
              Ativos
            </label>
          </div>
          <div className="form-check-inline">
            <input type="radio" name="FilterUsers" id="UsersInactive" className="form-check-input check__input"
              value="inactive" checked={filterUser === 'inactive'} onChange={e => setFilterUser(e.target.value)} />
            <label htmlFor="UsersInactive" className="form-check-label check__label">
              Inativos
            </label>
          </div>
          <Button variant="primary" className="btn-sm" onClick={handleFilterUsers}>Filtrar</Button>
        </div>

        <main>
          <ul className={`list__author ${listActive === 'author' ? 'active' : ''}`}>
            {authors.map(author => (
              <li key={author.id} className={user.id === author.id ? 'disabled' : ''}>
                <div className="users__data">
                  <div>
                    {author.avatar
                      ? <Avatar avatar={author.avatar} size={125} />
                      : <Avatar size={125} />}
                  </div>
                  <div>
                    <h4>{author.name}</h4>
                    <p>E-mail: {author.email}</p>
                    <p>Nickname: {author.nickname}</p>
                    <small>Conectado a {formatDistance(new Date(author.createdAt), new Date(), { locale: ptBR })}</small>
                  </div>
                </div>

                <div>
                  <Button variant="danger" className="btn-sm" onClick={() => inactiveUser(author)}>
                    Desativar conta
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <ul className={`list__reader ${listActive === 'reader' ? 'active' : ''}`}>
            {readers.map(reader => (
              <li key={reader.id} className={user.id === reader.id ? 'disabled' : ''}>
                <div className="users__data">
                  <div>
                    {reader.avatar
                      ? <Avatar avatar={reader.avatar} size={125} />
                      : <Avatar size={125} />}
                  </div>
                  <div>
                    <h4>{reader.name}</h4>
                    <p>E-mail: {reader.email}</p>
                    <p>Nickname: {reader.nickname}</p>
                    <small>Conectado a {formatDistance(new Date(reader.createdAt), new Date(), { locale: ptBR })}</small>
                  </div>
                </div>

                <div>
                  <Button variant="danger" className="btn-sm">
                    Desativar conta
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </Page>
  )
}

export default withPermission(['author'])(Users)