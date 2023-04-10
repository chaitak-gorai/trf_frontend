import { createContext, useEffect, useState } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    userName: '',
    profilePic: '',
    uid: '',
    accessToken: '',
  })

  const updateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo)
    localStorage.setItem('user', JSON.stringify(newUserInfo))
  }
  //implement local storage here

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      setUserInfo(user)
    }
  }, [])

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
