// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { TwitterAuthProvider, getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCOqa0mynHXNAtnfbCgRHiKXwAlsGvRd2A',
  authDomain: 'twitter-reply-filter.firebaseapp.com',
  projectId: 'twitter-reply-filter',
  storageBucket: 'twitter-reply-filter.appspot.com',
  messagingSenderId: '294298437408',
  appId: '1:294298437408:web:36f00974649175fa7d3945',
  measurementId: 'G-7J0QD1NKNG',
}

// Initialize Firebase

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new TwitterAuthProvider()
export { auth, provider }
