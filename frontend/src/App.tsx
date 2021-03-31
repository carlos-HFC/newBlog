import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'animate.css'
import './css/main.min.css'
import { useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { isAfter } from 'date-fns';
import { logout } from './services/auth';
import { notify } from './utils';
import { BlogContext, BlogProvider } from './context/BlogContext';

function App() {
  const now = new Date()
  const expiresToken = Cookies.get("EXP_TOKEN_BLOG")

  const { articles, categories, handleArticles, handleCategories } = useContext(BlogContext)

  // const [theme, setTheme] = useState<DefaultTheme>(Cookies.getJSON("THEME_BLOG") || light)
  // const [user, setUser] = useState<IUser>(Cookies.getJSON("user"))
  // const [articles, setArticles] = useState<IArticles[]>(Cookies.getJSON("articles_blog"))
  // const [categories, setCategories] = useState<ICategories[]>(Cookies.getJSON("categories_blog"))

  // useEffect(() => {
  //   Promise.all([
  //     api.get('/categories'),
  //     api.get('/articles')
  //   ]).then(response => {
  //     handleCategories(response[0].data)
  //     handleArticles(response[1].data)
  //   })
  // }, [])

  useEffect(() => {
    if (isAfter(now, Number(expiresToken))) {
      notify('warning', 'Você não está autenticado', 'danger')
      setTimeout(() => {
        logout()
      }, 1000)
    }
  })

  return (
    <BrowserRouter>
      <BlogProvider articles={articles} categories={categories}>
        <Routes />
      </BlogProvider>
    </BrowserRouter>
  );
}

export default App;
