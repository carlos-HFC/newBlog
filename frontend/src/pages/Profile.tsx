import { useContext } from 'react'

import { Perfil } from '../components'
import { UserContext } from '../context/UserContext'
import withPermission from '../utils/util'

function Profile() {
  const { user } = useContext(UserContext)

  return (
    <div>
      <Perfil user={user} />
    </div>
  )
}

export default withPermission(['author', 'reader'])(Profile)