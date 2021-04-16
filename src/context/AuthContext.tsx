import { createContext } from 'react'

function noop() {}

export const AuthContext = createContext({
  token: null,
  firstName: null,
  isAuthenticated: false,
  isLocalStorage: false,
  storageName: '',
  changeUserData: noop
})