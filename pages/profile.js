import Image from 'next/image'
import React, { useContext } from 'react'
import UserContext from '../components/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Twitter } from 'react-feather'
import Loader from '../components/Loader.js'
import Link from 'next/link'
import { useState } from 'react'

const Profile = () => {
  const { userInfo, updateUserInfo } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState()
  const router = useRouter()

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('user'))

    if (!userDetails) {
      router.push('/')
    } else {
      setUser(userDetails)
      console.log(user)
    }
  }, [])

  const [tweet, setTweet] = useState({
    tweet: '',
    name: '',
    userName: '',
    profilePic: '',
  })
  const [replies, setReplies] = useState([
    {
      text: '',
      name: '',
      userName: '',
      profilePic: '',
      isSpam: false,
    },
  ])
  const [currentTweetIndex, setCurrentTweetIndex] = useState(1)
  const fetchLastTweets = async () => {
    setLoading(true)
    if (user?.userName != undefined) {
      const response = await fetch(
        `https://trf.herokuapp.com/user/tweet/${user?.userName}/${currentTweetIndex}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()
      console.log(data)
      if (data.success == true) {
        console.log(data)
        setTweet(data.tweet)
        setReplies(data.reply)
      } else {
        alert('Invalid Index')
      }
    }
    setLoading(false)
  }

  const prevTweetHandler = () => {
    if (currentTweetIndex > 0) {
      setCurrentTweetIndex(currentTweetIndex - 1)
    }
  }
  const nextTweetHandler = () => {
    setCurrentTweetIndex(currentTweetIndex + 1)
  }
  const logoutHandler = () => {
    localStorage.removeItem('user')
    updateUserInfo(null)
    router.push('/')
  }
  useEffect(() => {
    if (user?.accessToken != '') {
      fetchLastTweets()
    }
  }, [currentTweetIndex, user])
  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6 md:justify-start md:space-x-10'>
            <div className='flex justify-start lg:w-0 lg:flex-1'>
              <div className='flex flex-row items-center justify-center'>
                <Link href='/'>
                  <span className='sr-only'>Logo</span>
                  <Twitter className='h-8 w-8  text-blue-500' />
                </Link>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Twitter Reply Filter
                </h1>
              </div>
            </div>
            <div className='md:flex items-center justify-end md:flex-1 lg:w-0'>
              <button
                className='px-4 py-2 mr-5 font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 text-white'
                onClick={logoutHandler}
              >
                Logout
              </button>
              {user && (
                <>
                  <span className='text-gray-600'>{user?.name}</span>
                  <Image
                    className='h-8 w-8 rounded-full ml-3'
                    src={user?.profilePic}
                    alt='Profile Picture'
                    width={32}
                    height={32}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
          <div className='flex flex-col w-full  '>
            <div className='bg-white shadow-md rounded-xl '>
              <div className='px-6 py-4'>
                <div className='flex flex-col items-center'>
                  <div className='flex-shrink-0 mr-4'>
                    <Image
                      className='h-16 w-16 rounded-full'
                      src={user?.profilePic}
                      alt='Profile Picture'
                      width={64}
                      height={64}
                    />
                  </div>
                  <div>
                    <h1 className='text-2xl font-bold '>{user?.name}</h1>
                    <p className='text-blue-500'>@{user?.userName}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white overflow-hidden shadow rounded-lg '>
              <div className='px-4 py-5 sm:p-6'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                  Recent Tweets
                </h3>
              </div>
              <div className='flex justify-between px-4 py-3 bg-gray-100'>
                {loading ? (
                  <Loader />
                ) : (
                  <button
                    className={`px-4 py-2 font-semibold rounded-lg ${
                      currentTweetIndex === 1
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    onClick={prevTweetHandler}
                    disabled={currentTweetIndex === 1}
                  >
                    Previous Tweet
                  </button>
                )}
                {loading ? (
                  <Loader />
                ) : (
                  <button
                    className={`px-4 py-2 font-semibold rounded-lg ${
                      currentTweetIndex === 10
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    onClick={nextTweetHandler}
                    disabled={currentTweetIndex === 10}
                  >
                    Next Tweet
                  </button>
                )}
              </div>
              {loading ? (
                <div className='flex justify-center items-center'>
                  <Loader />
                </div>
              ) : (
                <div className='max-w-lg mx-auto bg-white shadow-md rounded-md overflow-hidden'>
                  <div className='p-4 flex'>
                    <Image
                      className='w-10 h-10 rounded-full mr-2'
                      src={tweet.profilePic}
                      alt='User icon '
                      width={32}
                      height={32}
                    />
                    <div className='flex-grow'>
                      <div className='font-semibold text-sm'>{tweet.name}</div>
                      <div className='text-gray-500 text-xs text-blue-500'>
                        {tweet.userName}
                      </div>
                    </div>
                  </div>
                  <div className='px-4 py-2'>
                    <div className='text-lg font-medium'>{tweet.tweet}</div>
                  </div>
                  <div className='p-4 border-t border-gray-200'>
                    {replies.length > 0 ? (
                      replies.map((reply) => (
                        <div
                          key={Math.random()}
                          className={`p-2 rounded-md mb-2 ${
                            reply.isSpam ? 'bg-red-100' : 'bg-green-100'
                          }`}
                        >
                          <div className='flex'>
                            <Image
                              className='w-8 h-8 rounded-full mr-2'
                              src={reply.profilePic}
                              alt='User icon'
                              width={32}
                              height={32}
                            />
                            <div className='flex-grow'>
                              <div className='font-semibold text-sm'>
                                {reply.name}
                              </div>
                              <div className='text-gray-500 text-xs'>
                                {reply.userName}
                              </div>
                            </div>
                            {reply.isSpam ? (
                              <div className='flex items-center'>
                                <button className='mr-2'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                    className='w-4 h-4'
                                  >
                                    <path
                                      fillRule='evenodd'
                                      d='M17.707 4.293a1 1 0 010 1.414L8.414 15.707a1 1 0 01-1.414 0L2.293 10.414a1 1 0 011.414-1.414L8 13.586l8.293-8.293a1 1 0 011.414 0z'
                                      clipRule='evenodd'
                                    />
                                  </svg>
                                </button>
                                <button>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                    className='w-4 h-4'
                                  >
                                    <path
                                      fillRule='evenodd'
                                      d='M2.64,1.27L7.5,6.13l4.84-4.84C12.5114,1.1076,12.7497,1.0029,13,1c0.5523,0,1,0.4477,1,1&#xA;&#x9;c0.0047,0.2478-0.093,0.4866-0.27,0.66L8.84,7.5l4.89,4.89c0.1648,0.1612,0.2615,0.3796,0.27,0.61c0,0.5523-0.4477,1-1,1&#xA;&#x9;c-0.2577,0.0107-0.508-0.0873-0.69-0.27L7.5,8.87l-4.85,4.85C2.4793,13.8963,2.2453,13.9971,2,14c-0.5523,0-1-0.4477-1-1&#xA;&#x9;c-0.0047-0.2478,0.093-0.4866,0.27-0.66L6.16,7.5L1.27,2.61C1.1052,2.4488,1.0085,2.2304,1,2c0-0.5523,0.4477-1,1-1&#xA;&#x9;C2.2404,1.0029,2.4701,1.0998,2.64,1.27z'
                                      clipRule='evenodd'
                                    />
                                  </svg>
                                </button>
                              </div>
                            ) : null}
                          </div>
                          <div className='text-sm mt-1'>{reply.text}</div>
                        </div>
                      ))
                    ) : (
                      <div className='text-center text-gray-500'>
                        No replies yet
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
// <div className='mt-4'>
//   {tweets.map((tweet) => (
//     <div
//       key={tweet.id_str}
//       className='border-b border-gray-200 py-4'
//     >
//       <div className='flex space-x-3'>
//         <Image
//           className='rounded-full'
//           src={tweet.user.profilePic}
//           alt='Profile Picture'
//           width={48}
//           height={48}
//         />
//         <div className='flex-1'>
//           <div className='text-sm font-medium text-gray-900'>
//             {tweet.user.name}
//             <span className='ml-1 text-gray-600'>
//               @{tweet.user.screen_name}
//             </span>
//           </div>
//           <div className='mt-1 text-sm text-gray-700'>
//             {tweet.full_text}
//           </div>
//           <div className='mt-2 text-sm space-x-2'>
//             <span className='text-gray-600'>
//               {new Date(tweet.created_at).toLocaleString()}
//             </span>
//             <span className='text-gray-600'>·</span>
//             <span className='text-gray-600'>
//               {tweet.favorite_count} likes
//             </span>
//             <span className='text-gray-600'>·</span>
//             <span className='text-gray-600'>
//               {tweet.retweet_count} retweets
//             </span>
//           </div>
//           {tweet.replies && (
//             <div className='mt-2 bg-gray-100 rounded-lg p-4'>
//               {tweet.replies.map((reply) => (
//                 <div
//                   key={reply.id_str}
//                   className='border-b border-gray-200 py-4'
//                 >
//                   <div className='flex space-x-3'>
//                     <Image
//                       className='rounded-full'
//                       src={reply.user.profilePic}
//                       alt='Profile Picture'
//                       width={48}
//                       height={48}
//                     />
//                     <div className='flex-1'>
//                       <div className='text-sm font-medium text-gray-900'>
//                         {reply.user.name}
//                         <span className='ml-1 text-gray-600'>
//                           @{reply.user.screen_name}
//                         </span>
//                       </div>
//                       <div className='mt-1 text-sm text-gray-700'>
//                         {reply.full_text}
//                       </div>
//                       <div className='mt-2 text-sm space-x-2'>
//                         <span className='text-gray-600'>
//                           {new Date(
//                             reply.created_at
//                           ).toLocaleString()}
//                         </span>
//                         <span className='text-gray-600'>·</span>
//                         <span className='text-gray-600'>
//                           {reply.favorite_count} likes
//                         </span>
//                         <span className='text-gray-600'>·</span>
//                         <span className='text-gray-600'>
//                           {reply.retweet_count} retweets
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   ))}
// </div>

// <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
// <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
//   <div className='bg-white overflow-hidden shadow rounded-lg'>
//     <div className='px-4 py-5 sm:p-6'>
//       <dl>
//         <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5'>
//           <dt className='text-sm font-medium text-gray-500'>
//             Username
//           </dt>
//           <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
//             {user?.userName}
//           </dd>
//         </div>
//         <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5'>
//           <dt className='text-sm font-medium text-gray-500'>Name</dt>
//           <dd className='mt-1 text-sm text-gray-900  sm:mt-0 sm:col-span-2'>
//             {user?.name}
//           </dd>
//         </div>
//       </dl>
//     </div>
//   </div>
//   <div className='bg-white overflow-hidden shadow rounded-lg'>
//     <div className='px-4 py-5 sm:p-6'>
//       <h3 className='text-lg leading-6 font-medium text-gray-900'>
//         Recent Tweets
//       </h3>
//     </div>
//   </div>
// </div>
// </div>
