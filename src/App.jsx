import Chat from "./components/chat/Chat"
import List from "./components/list/List"
import Detail from "./components/detail/Detail"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"




const App = () => {
  
  // isLoading is different from that in login component 
  const {currentUser, isLoading, fetchUserInfo} = useUserStore()
  const { chatId } = useChatStore()
  // console.log(chatId)


  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user)=>{
      // console.log(user?.uid)
      // console.log(isLoading);


      // whenever state change(authentication) is detected, we can fetch our data
      fetchUserInfo(user?.uid)
    })

    return () => {
      unSub();
    }
  }, [fetchUserInfo]);

  // console.log(isLoading);
  // console.log(currentUser);

  if (isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {
        currentUser ? 
        (
        <>
        <List/>
        {chatId && <Chat/>}
        {chatId && <Detail/>}
        </>
        ) : (<Login/>)
      }
      <Notification/>
    </div>
  )
}

export default App