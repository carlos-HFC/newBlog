import { FC } from "react"
import { BsPersonSquare } from "react-icons/bs"

import { avatars } from '../utils'

interface IAvatar {
  avatar?: string
  size?: number
}

const Avatar: FC<IAvatar> = ({ avatar, size = 150 }) => {
  const icon = avatars.find(el => el.name === avatar) as any

  return avatar
    ? icon({ size })
    : <BsPersonSquare size={size} />
}

export default Avatar