import { FC } from "react"
import { BsPersonSquare } from "react-icons/bs"

import { avatars } from '../utils'

interface IAvatar {
  avatar?: string
}

const Avatar: FC<IAvatar> = ({ avatar }) => {
  const icon = avatars.find(el => el.name === avatar) as any

  return avatar
    ? icon({ size: 150 })
    : <BsPersonSquare size={150} />
}

export default Avatar