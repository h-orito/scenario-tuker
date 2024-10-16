import {
  TwitterAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth'
import { auth } from './firebase-config'

import { postRequest } from '@/components/api/api'

export const signInWithTwitter = async () => {
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
  location.reload()
}

export const signInWithGoogle = async () => {
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
  location.reload()
}

export const linkWithTwitter = async () => {
  if (!auth.currentUser) return
  try {
    await linkWithPopup(auth.currentUser, new TwitterAuthProvider())
  } catch ({ code, message }: any) {
    console.log(code, message)
  }
  location.reload()
}

export const linkWithGoogle = async () => {
  if (!auth.currentUser) return
  try {
    await linkWithPopup(auth.currentUser, new GoogleAuthProvider())
  } catch ({ code, message }: any) {
    console.log(code, message)
  }
  location.reload()
}

export const hasTwitterLinked = (authState: AuthState): boolean => {
  return (authState.user as any).providerData.some(
    (info: any) => info.providerId === 'twitter.com'
  )
}

export const hasGoogleLinked = (authState: AuthState) => {
  return (authState.user as any).providerData.some(
    (info: any) => info.providerId === 'google.com'
  )
}

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth)
  location.reload()
}
