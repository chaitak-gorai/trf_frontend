import { createContext, useState } from 'react'

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
  }

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
