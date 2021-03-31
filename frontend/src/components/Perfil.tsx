import { ChangeEvent, FC, FormEvent, useContext, useState } from "react"
import { Modal } from "react-bootstrap"

import { Avatar, Button, InputBlock, Page } from "."
import { IUser } from "../@types"
import { UserContext } from "../context/UserContext"
import { logout } from "../services/auth"
import { avatars, notify } from "../utils"
import api from "../services/api"
import withPermission from "../utils/util"

interface IPerfil {
  user: IUser
}

const Perfil: FC<IPerfil> = ({ user }) => {
  const { handleLogin } = useContext(UserContext)

  const [toggleModalEdit, setToggleModalEdit] = useState(false)
  const [toggleModalAvatar, setToggleModalAvatar] = useState(false)
  const [avatar, setAvatar] = useState(String(user.avatar))
  const [edit, setEdit] = useState({
    name: "",
    nickname: "",
    email: "",
    oldPass: "",
    password: "",
    confirmPass: "",
  })

  function handleChangeEdit(e: ChangeEvent<HTMLInputElement>) {
    setEdit({ ...edit, [e.target.name]: e.target.value })
  }

  function cancelUpdateAvatar() {
    setToggleModalAvatar(false)
    setAvatar(String(user.avatar))
  }

  async function updateAvatar() {
    try {
      const response = await api.patch('/users', { avatar })

      if (response.status === 200) {
        setToggleModalAvatar(false)

        notify('success', response.data.message, 'success')

        const me = await api.get('/users/profile')
        handleLogin(me.data as IUser)
      }
    } catch (error) {
      return notify('error', error.response.data.message, 'danger')
    }
  }

  function cancelUpdateUser() {
    setToggleModalEdit(false)
    setEdit({
      name: "",
      nickname: "",
      email: "",
      oldPass: "",
      password: "",
      confirmPass: "",
    })
  }

  async function updateUser(e: FormEvent) {
    e.preventDefault()
    const { name, nickname, email, oldPass, password, confirmPass } = edit

    const data = {}

    if (name.trim()) Object.assign(data, { name })
    if (email.trim()) Object.assign(data, { email })
    if (nickname.trim()) Object.assign(data, { nickname })
    if (oldPass.trim()) Object.assign(data, { oldPass })
    if (password.trim()) Object.assign(data, { password })
    if (confirmPass.trim()) Object.assign(data, { confirmPass })

    try {
      const response = await api.patch('/users', { ...data })

      if (response.status === 200) {
        setToggleModalEdit(false)
        setEdit({
          name: "",
          nickname: "",
          email: "",
          oldPass: "",
          password: "",
          confirmPass: "",
        })

        if ((nickname && nickname !== user.nickname) || (email && email !== user.email) || password) return setTimeout(() => logout(), 500)

        notify('success', response.data.message, 'success')

        const me = await api.get('/users/profile')
        handleLogin(me.data as IUser)
      }
    } catch (error) {
      console.log(error.response)
      return notify('error', error.response.data.message, 'danger')
    }
  }

  return (
    <>
      <Modal show={toggleModalAvatar} onHide={cancelUpdateAvatar}>
        <Modal.Header>
          <Modal.Title>Escolha um avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="avatars">
            {avatars.map((el, i) => (
              <li key={i} onClick={() => setAvatar(el.name)} className={avatar.includes(el.name) ? 'selected' : ''}>{el({})}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={updateAvatar}>
            Atualizar
          </Button>
          <Button variant="secondary" onClick={cancelUpdateAvatar}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={toggleModalEdit} onHide={cancelUpdateUser}>
        <Modal.Header>
          <Modal.Title>Editar Dados Pessoais</Modal.Title>
        </Modal.Header>
        <form onSubmit={updateUser}>
          <Modal.Body>
            <InputBlock label="Nome" name="name" defaultValue={user.name} onChange={handleChangeEdit} />
            <InputBlock type="email" label="E-mail" name="email" defaultValue={user.email} onChange={handleChangeEdit} />
            <InputBlock label="Nickname" name="nickname" defaultValue={user.nickname} onChange={handleChangeEdit} />
            <InputBlock label="Senha Atual" password name="oldPass" value={edit.oldPass} onChange={handleChangeEdit} />
            <InputBlock label="Nova Senha" password name="password" value={edit.password} onChange={handleChangeEdit} />
            <InputBlock label="Confirmar Senha" password name="confirmPass" value={edit.confirmPass} onChange={handleChangeEdit} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit">
              Atualizar
            </Button>
            <Button variant="secondary" onClick={cancelUpdateUser}>
              Cancelar
          </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <Page title="Perfil">
        <div className="profile">
          <section>
            <div className="profile__img" onClick={() => setToggleModalAvatar(true)}>
              <Avatar avatar={user.avatar} />
            </div>

            <ul>
              <li>
                <span>Nome: </span> {user.name}
              </li>
              <li>
                <span>Nickname: </span> {user.nickname}
              </li>
              <li>
                <span>E-mail: </span> {user.email}
              </li>
            </ul>
          </section>

          <section className="d-flex">
            <Button variant="warning" onClick={() => setToggleModalEdit(!toggleModalEdit)}>
              Editar
            </Button>
            <Button variant="danger">
              Excluir
            </Button>
          </section>
        </div>
      </Page>
    </>
  )
}

export default withPermission(['author', 'reader'])(Perfil)
