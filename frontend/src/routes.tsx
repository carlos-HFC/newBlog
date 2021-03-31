import { useContext, useEffect, useState } from 'react'
import { Redirect, Route, RouteProps, Switch, useRouteMatch } from 'react-router-dom'
import { DefaultTheme, ThemeProvider } from 'styled-components'
import Cookies from 'js-cookie'

import { IUser } from './@types'
import { Header } from './components'
import { UserProvider } from './context/UserContext'
import { BlogContext } from './context/BlogContext'
import { Articles, Categories, Login, Profile } from './pages'
import { isAuth } from './services/auth'
import api from './services/api'

import { dark, light } from './css/themes'
import GlobalStyle from './css/styles'

function Private(props: RouteProps) {
  if (!isAuth() && !Cookies.getJSON("user")) return <Redirect to={{ pathname: '/', state: props.location }} />

  return (
    <>
      <Route path="/profile" component={Profile} />
    </>
  )
}

function Routes() {
  const { handleArticles, handleCategories, categories } = useContext(BlogContext)

  const [theme, setTheme] = useState<DefaultTheme>(Cookies.getJSON("THEME_BLOG") || light)
  const [user, setUser] = useState<IUser>(Cookies.getJSON("user"))

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/articles')
    ]).then(response => {
      handleCategories(response[0].data)
      handleArticles(response[1].data)
    })
  }, [])

  useEffect(() => {
    setUser(Cookies.getJSON("user"))
  }, [])

  useEffect(() => {
    Cookies.set("THEME_BLOG", theme)
  }, [theme])

  const handleTheme = () => setTheme(theme.title === 'light' ? dark : light)

  const route = useRouteMatch('/login')

  return (
    <Switch>
      <UserProvider user={user}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          {!route && <Header handleTheme={handleTheme} />}
          <Route exact path="/" component={() => <h1>Hello</h1>} />
          <Route path="/login" component={Login} />
          <Route exact path="/articles" component={Articles} />
          <Route exact path="/categories/:name" component={() => <Categories categories={categories} />} />
          <Private component={Profile} />
        </ThemeProvider>
      </UserProvider>
    </Switch>
  )
}

export default Routes