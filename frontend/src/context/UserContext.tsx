import { createContext, ReactNode, useEffect, useState } from "react";
import Cookies from 'js-cookie'

import { IUser } from '../@types'

interface UserContextProps {
  user: IUser
  handleLogin: (user: IUser) => void
}

interface UserProviderProps {
  children: ReactNode
  user: IUser
}

export const UserContext = createContext({} as UserContextProps)

export function UserProvider({ children, ...rest }: UserProviderProps) {
  const [user, setUser] = useState(rest.user)

  useEffect(() => {
    Cookies.set("user", user)
  }, [user])

  function handleLogin(user: IUser) {
    setUser(user)
  }

  return (
    <UserContext.Provider value={{ user, handleLogin }}>
      {children}
    </UserContext.Provider>
  )
}