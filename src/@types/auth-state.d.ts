type AuthState = {
  isAuthenticated: boolean
  isSignedIn: boolean
  user: import('firebase/auth').User | null
  userId: string | null
  userName: string | null
  myself: User | null
}
