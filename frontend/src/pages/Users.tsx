import { Page } from '../components'
import withPermission from '../utils/util'


function Users() {

  return (
    <Page title="Usuários">
    </Page>
  )
}

export default withPermission(['author'])(Users)