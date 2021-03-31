import { useContext } from 'react'

import { Perfil } from '../components'
import { UserContext } from '../context/UserContext'

export default function Profile() {
  const { user } = useContext(UserContext)

  return (
    <div>
      <Perfil user={user} />
    </div>
  )
}
