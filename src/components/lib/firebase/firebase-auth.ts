import {
  User as FirebaseUser,
  Auth,
  getAuth,
  TwitterAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  signOut
} from 'firebase/auth'
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  setTokenExpired,
  getTokenExpired
} from '../../auth/auth-cookie'
import dayjs from '../dayjs/dayjs'
import useAuth from '@/components/auth/auth'
import { postRequest } from '@/components/api/api'

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
    const authState = await useAuth()
    if (!authState.user) return null
    setAuthorizationCookie(authState.user)
  }

  return getAccessToken()
}

export const signInWithTwitter = async (auth: Auth) => {
  let result = null
  try {
    result = await signInWithPopup(auth, new TwitterAuthProvider())
  } catch ({ code, message }: any) {
    console.log(code, message)
  }
  if (!result) return
  try {
    const credential = TwitterAuthProvider.credentialFromResult(result)
    if (!credential) return
    const user = result.user
    await postRequest<any, User>('users', {
      uid: user.uid,
      name: user.displayName!,
      twitter: {
        twitter_id: (user as any).reloadUserInfo?.providerUserInfo.find(
          (info: any) => info.providerId === 'twitter.com'
        )?.rawId,
        screen_name: (user as any).reloadUserInfo?.screenName,
        access_token: credential.accessToken,
        token_secret: credential.secret
      }
    })
  } catch (e) {
    console.log(e)
  }
}

export const signInWithGoogle = async (auth: Auth) => {
  let result = null
  try {
    result = await signInWithPopup(auth, new GoogleAuthProvider())
  } catch ({ code, message }: any) {
    console.log(code, message)
  }
  if (!result) return
  try {
    const credential = GoogleAuthProvider.credentialFromResult(result)
    if (!credential) return
    const user = result.user
    console.log(user)
    await postRequest<any, User>('users', {
      uid: user.uid,
      name: user.displayName
    })
  } catch (e) {
    console.log(e)
  }
}

export const linkWithTwitter = async (auth: Auth) => {
  if (!auth.currentUser) return
  try {
    await linkWithPopup(auth.currentUser, new TwitterAuthProvider())
  } catch ({ code, message }: any) {
    console.log(code, message)
  }
}

export const linkWithGoogle = async (auth: Auth) => {
  if (!auth.currentUser) return
  try {
    await linkWithPopup(auth.currentUser, new GoogleAuthProvider())
  } catch ({ code, message }: any) {
    console.log(code, message)
  }
}
