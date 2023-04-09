import '../styles/globals.css'
import { UserProvider } from '../components/AuthContext.js'

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
