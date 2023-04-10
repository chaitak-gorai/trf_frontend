import React, { use, useContext, useEffect } from 'react'
import { getAuth, signInWithPopup, TwitterAuthProvider } from 'firebase/auth'
import { auth, provider } from '../firebase'
import { Twitter } from 'react-feather'
import axios from 'axios'
import { useRouter } from 'next/router'
import UserContext from '../components/AuthContext.js'
import Loader from '../components/Loader.js'
import { useState } from 'react'

const TwitterAuth = () => {
  const router = useRouter()
  const { userInfo, updateUserInfo } = useContext(UserContext)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const loginHandler = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const credential = TwitterAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      const secret = credential.secret
      console.log(token)
      console.log(secret)
      console.log(user)
      //axios call to backend

      const loginResponse = await axios.post(
        'https://trf.herokuapp.com/user/login',
        {
          userName: user.reloadUserInfo.screenName,
          uid: user.uid,
          name: user.reloadUserInfo.displayName,
          accessToken: token,
          tokenSecret: secret,
          profilePic: user.reloadUserInfo.photoUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (loginResponse.status === 200 || loginResponse.status === 201) {
        console.log('Login Success')
        const userData = loginResponse.data
        const userI = {
          name: userData.name,
          userName: userData.userName,
          profilePic: userData.profilePic,
          uid: userData.uid,
          accessToken: userData.accessToken,
        }
        localStorage.setItem('user', JSON.stringify(userI))
        setUser(userI)
        console.log(userI)
        if (user.accessToken != '') {
          setLoading(false)
          router.push('/profile')
        }
      }
      console.log(loginResponse)

      // IdP data available using getAdditionalUserInfo(result)
      // ...
      console.log(user)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      router.push('/profile')
    }
  }, [userInfo, router])
  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <div className='bg-white p-8 rounded shadow-md'>
        <div className='text-center'>
          <Twitter className='h-8 w-8 mx-auto mb-4 text-blue-500' />
          <h1 className='text-2xl font-bold mb-2'>Login with Twitter</h1>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <button
            onClick={loginHandler}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'
          >
            Login with Twitter
          </button>
        )}
      </div>
    </div>
  )
}

export default TwitterAuth
