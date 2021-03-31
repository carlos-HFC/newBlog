import { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { BlogContext, BlogProvider } from './context/BlogContext';
import Routes from './routes';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'animate.css'
import './css/main.min.css'

function App() {
  const { articles, categories } = useContext(BlogContext)

  return (
    <BrowserRouter>
      <BlogProvider articles={articles} categories={categories}>
        <Routes />
      </BlogProvider>
    </BrowserRouter>
  );
}

export default App;
