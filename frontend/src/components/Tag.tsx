import { FC } from "react"
import { BsTagFill } from "react-icons/bs"

import { ICategories } from '../@types'

interface ITag {
  list: ICategories[]
}

const Tag: FC<ITag> = ({ list }) => {
  return (
    <ul>
      {list?.map(item => <li key={item.id} className="badge"><BsTagFill /> {item.name}</li>)}
    </ul>
  )
}

export default Tag
