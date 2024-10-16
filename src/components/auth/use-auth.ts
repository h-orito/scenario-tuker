import { useEffect } from 'react'
import { atom, useAtom, useAtomValue } from 'jotai'
import { onAuthStateChanged } from '../lib/firebase/firebase-config'
import { fetchMyself } from '../api/myself-api'
import { removeAuthorizationCookie, setAuthorizationCookie } from './auth'

const initialAuthState = {
  isAuthenticated: false,
  isSignedIn: false,
  user: null,
  userId: null,
  userName: null,
  myself: null
}
const authAtom = atom<AuthState>(initialAuthState)

export const useSetAuth = (): AuthState => {
  const [state, setState] = useAtom(authAtom)
  useEffect(() => {
    const fetch = async () => {
      const state = await auth()
      setState(state)
    }
    if (!state.isAuthenticated) {
      fetch()
    }
  }, [])

  return state
}

export const useAuth = () => useAtomValue(authAtom)

const auth = async (): Promise<AuthState> => {
  if (typeof window === 'undefined') {
    return initialAuthState
  }
  const user = await onAuthStateChanged()
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
    return state
  }
  await setAuthorizationCookie(user)
  state.myself = await fetchMyself()
  return state
}
