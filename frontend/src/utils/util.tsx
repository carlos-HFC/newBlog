import { FC } from "react";
import { Redirect } from "react-router-dom";
import Cookies from 'js-cookie'

import { IUser } from '../@types'

const withPermission = (roles: string[]) =>
  (Component: FC<any>) => (props: any) => {
    const { role } = Cookies.getJSON("user") as IUser

    if (!role) return <Redirect to="/" />

    return roles.includes(String(role).toLowerCase())
      ? <Component {...props} />
      : <Redirect to="profile" />
  }

export default withPermission