import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  setTokenExpired,
  getTokenExpired
} from './auth-cookie'
import dayjs from '../lib/dayjs/dayjs'
import { User as FirebaseUser } from 'firebase/auth'
import { auth as firebaseAuth } from '../lib/firebase/firebase-config'

export const setAuthorizationCookie = async (user: FirebaseUser) => {
  const token = await user.getIdToken(true)
  await setAccessToken(token)
  await setRefreshToken(user.refreshToken)
  const expired = dayjs().add(50, 'm')
  await setTokenExpired(expired.format())
}

export const removeAuthorizationCookie = async () => {
  await setAccessToken('')
}

export const refreshAccessTokenIfNeeded = async (): Promise<string | null> => {
  const expired = getTokenExpired()
  if (!expired || expired === '') return null
  const ex = dayjs(expired)
  const now = dayjs()
  if (now.isSameOrAfter(ex)) {
    if (!firebaseAuth.currentUser) return null
    setAuthorizationCookie(firebaseAuth.currentUser)
  }

  return getAccessToken()
}
