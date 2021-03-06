import { isAfter } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { Redirect, Route, RouteProps, Switch, useRouteMatch } from 'react-router-dom'
import { DefaultTheme, ThemeProvider } from 'styled-components'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

import { IUser } from './@types'
import { Footer, Header } from './components'
import { BlogContext } from './context/BlogContext'
import { UserProvider } from './context/UserContext'
import { ArticleRead, Articles, Home, Login, Profile, Users } from './pages'
import { isAuth, logout } from './services/auth'
import api from './services/api'

import { dark, light } from './css/themes'
import GlobalStyle from './css/styles'

function Private(props: RouteProps) {
  if (!isAuth()) return <Redirect to={{ pathname: '/', state: props.location }} />

  return (
    <>
      <Route exact path="/articles" component={Articles} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/users" component={Users} />
    </>
  )
}

let countdown: NodeJS.Timeout

function Routes() {
  const route = useRouteMatch('/login')

  const [time, setTime] = useState<Date | null>(null)
  const [theme, setTheme] = useState<DefaultTheme>(Cookies.getJSON("THEME_BLOG") || light)
  const [user, setUser] = useState<IUser>(Cookies.getJSON("user"))

  const expiresToken = Cookies.get("EXP_TOKEN_BLOG")
  const cookieUser = Cookies.get("user")

  const { handleArticles, handleCategories } = useContext(BlogContext)

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/articles')
    ]).then(response => {
      handleCategories(response[0].data)
      handleArticles(response[1].data)
    })
    setUser(Cookies.getJSON("user"))
  }, [])

  useEffect(() => {
    if (cookieUser !== "undefined") {
      countdown = setTimeout(() => {
        setTime(new Date())
      }, 1000)
    } else {
      clearTimeout(countdown)
      setTime(null)
    }
  }, [time, cookieUser])

  useEffect(() => {
    Cookies.set("THEME_BLOG", theme)
  }, [theme])

  if (isAfter(time as Date, new Date(String(expiresToken)))) {
    clearTimeout(countdown)
    setTime(null)
    Swal.fire({
      title: "Oopss...",
      text: "Sua sess??o expirou, voc?? ser?? redirecionado!!",
      icon: "warning",
      showConfirmButton: false,
      timer: 5000,
      didOpen: () => {
        setTimeout(() => {
          return logout()
        }, 500)
      }
    })
  }

  const handleTheme = () => setTheme(theme.title === 'light' ? dark : light)

  return (
    <Switch>
      <UserProvider user={user}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          {!route && <Header handleTheme={handleTheme} />}
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/articles/:id" component={ArticleRead} />
          <Private />
          {!route && <Footer />}
        </ThemeProvider>
      </UserProvider>
    </Switch>
  )
}

export default Routes