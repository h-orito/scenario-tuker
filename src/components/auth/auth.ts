import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  auth as firebaseAuth
} from '../lib/firebase/firebase-config'
import {
  removeAuthorizationCookie,
  setAuthorizationCookie
} from '../lib/firebase/firebase-auth'
import { fetchMyself } from '../api/myself-api'

const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isSignedIn: false,
    user: null,
    userId: null,
    userName: null,
    myself: null
  })
  useEffect(() => {
    auth(setAuthState)
  }, [])

  return authState
}

const auth = async (
  setAuthState: Dispatch<SetStateAction<AuthState>>
): Promise<void> => {
  return new Promise<void>((resolve) => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      const state: AuthState = {
        isAuthenticated: true,
        isSignedIn: !!user,
        user: user,
        userId: user?.uid ?? null,
        userName: user?.displayName ?? null,
        myself: null
      }
      if (!user) {
        await removeAuthorizationCookie()
        setAuthState(state)
        resolve()
        return
      }
      await setAuthorizationCookie(user)
      state.myself = await fetchMyself()
      setAuthState(state)
      resolve()
    })
  })
}

export default useAuth
