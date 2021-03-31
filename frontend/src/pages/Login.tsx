import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Modal } from 'react-bootstrap'
import { BsArrowLeft } from "react-icons/bs";
import { useHistory } from "react-router";

import { IUser } from "../@types";
import { Button, InputBlock } from "../components";
import { UserContext } from "../context/UserContext";
import { setToken, tokenExpires } from "../services/auth";
import { avatars, notify } from "../utils";
import api from "../services/api";
import Cookies from "js-cookie";
import { isAfter } from "date-fns";

export default function Login() {
  const history = useHistory()
  const { handleLogin } = useContext(UserContext)

  const [formActive, setFormActive] = useState('signin')
  const [login, setLogin] = useState({
    username: "",
    password: ""
  })
  const [register, setRegister] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPass: "",
  })
  const [avatar, setAvatar] = useState("")
  const [toggleModal, setToggleModal] = useState(false)

  function handleChangeLogin(e: ChangeEvent<HTMLInputElement>) {
    setLogin({ ...login, [e.target.name]: e.target.value })
  }

  function handleChangeRegister(e: ChangeEvent<HTMLInputElement>) {
    setRegister({ ...register, [e.target.name]: e.target.value })
  }

  async function effectLogin(e: FormEvent) {
    e.preventDefault()

    if (Object.values(login).some(item => !item)) return notify('error', 'Preencha os campos obrigatórios!!', 'danger')

    try {
      const response = await api.post('/auth/login', { ...login })

      console.log(response.data)

      setToken(response.data.access.token)
      tokenExpires(response.data.access.expiresIn)

      const tmp = Cookies.get("EXP_TOKEN_BLOG")

      const atual = isAfter(new Date(), Number(tmp))

      console.log(new Date(Number(tmp)))
      console.log(atual)

      handleLogin(response.data.user as IUser)
      return history.push('/')
    } catch (error) {
      return notify('error', error.response.data.message, 'danger')
    }
  }

  async function effectRegister(e: FormEvent) {
    e.preventDefault()

    if (Object.values(register).some(item => !item)) return notify('error', 'Preencha os campos obrigatórios!!', 'danger')

    try {
      const response = await api.post('/auth/register', { ...register, avatar })

      console.log(response.data)
    } catch (error) {
      return notify('error', error.response.data.message, 'danger')
    }
  }

  return (
    <>
      <Modal show={toggleModal} onHide={() => setToggleModal(!toggleModal)}>
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
      </Modal>
      <section className="form__section">
        <div className={`form__wrapper ${formActive}`}>
          <BsArrowLeft size={24} title="Voltar" color="white" cursor="pointer" onClick={() => history.push('/')} />
          <div className="form">
            <header>
              <span onClick={() => setFormActive('signin')} className={formActive === 'signin' ? 'active' : ''}>Login</span>
              <span onClick={() => setFormActive('signup')} className={formActive === 'signup' ? 'active' : ''}>Cadastrar-se</span>
            </header>

            <form onSubmit={effectLogin} autoComplete="off" className={`form__login ${formActive === 'signin' ? 'active' : ''}`}>
              <InputBlock label="E-mail ou Nickname" name="username" value={login.username} onChange={handleChangeLogin} required />
              <InputBlock label="Senha" password name="password" value={login.password} onChange={handleChangeLogin} required />
              <div className="d-flex mt-3">
                <Button variant="primary">Entrar</Button>
              </div>
            </form>

            <form onSubmit={effectRegister} autoComplete="off" className={`form__signup ${formActive === 'signup' ? 'active' : ''}`}>
              <InputBlock label="Nome" name="name" value={register.name} onChange={handleChangeRegister} required />
              <InputBlock label="Nickname" name="nickname" value={register.nickname} onChange={handleChangeRegister} required />
              <InputBlock type="email" label="E-mail" name="email" value={register.email} onChange={handleChangeRegister} required />
              <div className="col mb-2">
                <div className="row" id="avatar">
                  <label htmlFor="avatar">Avatar</label>
                  <span onClick={() => setToggleModal(!toggleModal)}>{!toggleModal && avatars.map(el => el.name === avatar && el({}))}</span>
                </div>
              </div>
              <InputBlock label="Senha" password name="password" value={register.password} onChange={handleChangeRegister} required />
              <InputBlock label="Confirmar Senha" password name="confirmPass" value={register.confirmPass} onChange={handleChangeRegister} required />
              <div className="d-flex mt-3">
                <Button variant="primary">Cadastrar</Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
