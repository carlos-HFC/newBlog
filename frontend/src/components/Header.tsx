import { FC, useContext } from "react"
import { Navbar, Nav, Dropdown } from "react-bootstrap"
import { BsBoxArrowRight, BsChatSquareDots, BsPersonSquare } from "react-icons/bs"
import { LinkContainer } from "react-router-bootstrap"
import { NavLink, useHistory } from "react-router-dom"
import { ThemeContext } from "styled-components"

import { Avatar } from "."
import { UserContext } from "../context/UserContext"
import { isAuth, logout } from '../services/auth'

interface IHeader {
  handleTheme(): void
}

const Header: FC<IHeader> = ({ handleTheme }) => {
  const history = useHistory()
  const { user } = useContext(UserContext)
  const { title } = useContext(ThemeContext)

  return (
    <header className="header">
      <Navbar expand="lg" className="container-fluid">
        <LinkContainer to="/">
          <Navbar.Brand title="BLOG">
            Blog <BsChatSquareDots />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle>
          <div />
          <div />
          <div />
        </Navbar.Toggle>
        <Navbar.Collapse>
          <Nav className="m-auto align-items-lg-center" activeKey={history.location.pathname}>
            {user?.role === 'author' &&
              <>
                <NavLink className="nav-link" to="/articles">Artigos</NavLink>
                <NavLink className="nav-link" to="/users">Usuários</NavLink>
              </>}
          </Nav>
          <Nav className="align-items-lg-center" activeKey={history.location.pathname}>
            <label className="switch">
              <input type="checkbox" onClick={handleTheme} defaultChecked={title === 'dark'} />
              <span className="slider-round" />
            </label>
            {!isAuth()
              ? (
                <NavLink to="/login" className="btn btn-outline-light">
                  Login/Cadastrar
                </NavLink>
              ) : (
                <Dropdown as="div" navbar alignRight>
                  <Dropdown.Toggle as="a" role="button" className="nav-link">
                    {user.nickname} <Avatar avatar={user.avatar} size={16} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <LinkContainer to="/profile">
                      <Dropdown.Item>
                        <BsPersonSquare className="mr-2" /> Perfil
                      </Dropdown.Item>
                    </LinkContainer>
                    <Dropdown.Item onClick={logout}>
                      <BsBoxArrowRight className="mr-2" /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}

export default Header