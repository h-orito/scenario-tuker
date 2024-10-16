import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import {
  getAuth,
  User,
  Auth,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID
}

let firebaseApp: FirebaseApp
let auth: Auth

if (typeof window !== 'undefined' && !getApps().length) {
  firebaseApp = initializeApp(firebaseConfig)
  auth = getAuth()
}

const onAuthStateChanged = async (): Promise<User | null> => {
  return new Promise<User | null>((resolve) => {
    firebaseOnAuthStateChanged(auth, (user) => {
      resolve(user)
    })
  })
}

export { firebaseApp, auth, onAuthStateChanged }
