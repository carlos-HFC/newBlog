import { FC } from "react"

import { ICategories } from '../@types'

interface ITag {
  list: ICategories[]
}

const Tag: FC<ITag> = ({ list }) => {
  return (
    <ul className="tag">
      {list?.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  )
}

export default Tag
