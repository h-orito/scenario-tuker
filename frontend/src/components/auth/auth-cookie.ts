import Cookies from 'universal-cookie'

export const cookieKeys = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  tokenExpired: 'token_expired'
}

const options = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24
}

export const getAccessToken = (): string | null => {
  const cookies = new Cookies()
  return cookies.get(cookieKeys.accessToken)
}

export const setAccessToken = (token: string) => {
  const cookies = new Cookies()
  cookies.set(cookieKeys.accessToken, token, options)
}

// 認証関連の Cookie をすべて削除する
// refresh_token は以前のバージョンで保存していたものを消すために残している
export const removeAuthCookies = () => {
  const cookies = new Cookies()
  cookies.remove(cookieKeys.accessToken, { path: '/' })
  cookies.remove(cookieKeys.refreshToken, { path: '/' })
  cookies.remove(cookieKeys.tokenExpired, { path: '/' })
}

export const removeLegacyRefreshToken = () => {
  const cookies = new Cookies()
  cookies.remove(cookieKeys.refreshToken, { path: '/' })
}

export const getTokenExpired = (): string | null => {
  const cookies = new Cookies()
  return cookies.get(cookieKeys.tokenExpired)
}

export const setTokenExpired = (date: string) => {
  const cookies = new Cookies()
  cookies.set(cookieKeys.tokenExpired, date, options)
}
