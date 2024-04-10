import { createContext } from 'react'

function noop() {}

export const AuthContext = createContext({
  token: null,
  user: null,
  userId: null,
  // userTypeId: null,
  // storeId: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
})
