import { useContext } from 'react'

import { Page, Posts } from '../components'
import { BlogContext } from '../context/BlogContext'

export default function ArticleRead() {
  const { articles } = useContext(BlogContext)

  return (
    <Page>
      <Posts articles={articles} />
    </Page>
  )
}
