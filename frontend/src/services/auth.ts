import Cookies from 'js-cookie'

export const isAuth = () => Cookies.get("TOKEN_BLOG") !== undefined
export const logout = () => {
  Cookies.remove("TOKEN_BLOG")
  Cookies.remove("EXP_TOKEN_BLOG")
  Cookies.remove("user")
  window.location.href = "/"
}
export const setToken = (token: string) => Cookies.set("TOKEN_BLOG", token)
export const tokenExpires = (exp: Date) => Cookies.set("EXP_TOKEN_BLOG", exp)