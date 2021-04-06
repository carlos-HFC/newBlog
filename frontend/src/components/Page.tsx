import { FC } from "react"

interface IPage {
  title?: string
}

const Page: FC<IPage> = ({ children, title }) => {
  return (
    <main className="m-3">
      <div className="container p-3">
        {title && <><h2 className="text-center font-weight-bold mb-3" title={title}>{title}</h2><hr /></>}
        <section>
          {children}
        </section>
      </div>
    </main>
  )
}

export default Page
