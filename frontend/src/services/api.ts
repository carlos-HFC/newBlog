import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({ baseURL: "http://localhost:8000" })

api.interceptors.request.use(config => {
  const token = Cookies.get("TOKEN_BLOG")

  if (token) config.headers.Authorization = `Bearer ${token}`

  return config
})

export default api