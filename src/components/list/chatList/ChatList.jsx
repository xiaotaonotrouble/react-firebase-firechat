import { useEffect, useState } from "react"
import "./chatList.css"
import AddUser from "./addUser/AddUser"
import { useUserStore } from "../../../lib/userStore"
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";


const ChatList = () => {
  const [addMode, SetAddMode] = useState(false);
  const [chats, setChats] = useState([]); // initially, it's going to be an empty array (Element in this chat array represents a session with a friend, one to one correspondence )
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat, user } = useChatStore();

  // console.log(chatId)

  useEffect(() => { // Whenever we run this page, it will automatically fetch the chats, and we need to store it somewhere -> [chats, setChats]
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => { // doc() will return the respond, which is furthur passed to call-back function
      const items = res.data().chats;   // .data() returns the data(key, value) pairs. In this case we only have one key: chats. So retrive it.
      // for each chat, find its user(receiver)
      const promises = items.map( async (item) => {
        const userDocRef = doc(db, "user", item.receiverId);
        const userDocSnap = await getDoc(userDocRef); // this one actually performs the database query

        const user = userDocSnap.data();

        // return all the info both chat and its user
        return {...item, user};  
      });
      const chatData = await Promise.all(promises); // This line does the actual job of getting user data and merge with chat item (resolution of the promise)
                                                    // now chatData has both userChat info and user info!!! We can get the user's name and profile picture

      setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt));  // each element in chat is a chat session to a friend
      });
      return () => {
        unSub();
      }
  
  }, [currentUser.id]); // a dependency: whenever current userID changes, we need to clean up and refetch  ???  seems unnecessary

  // console.log(chats)

  const handleSelect = async (chat) => {  // This chat has normal data info and user info in it
    // console.log(chat);

    const userChats = chats.map((item) => {
      const {user, ...rest} = item;
      return rest;
    });

    const chatIndex = userChats.findIndex((item)=>item.chatId === chat.chatId)
    userChats[chatIndex].isSeen = true;
    const c_userChatsRef = doc(db, "userchats", currentUser.id);

    if (chatId) {
      const f_chatIndex = userChats.findIndex((item)=>item.chatId === chatId)
      userChats[f_chatIndex].isSeen = true;
    }

    try {
      await updateDoc(c_userChatsRef, {
        chats: userChats,
      })


      changeChat(chat.chatId, chat.user, currentUser);
    } catch (err) {
      console.log(err)
    }
    

    


  }

  const filteredChats = chats.filter((c) => 
    c.user?.username.toLowerCase().includes(input.toLowerCase())
);

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" onChange={(e)=>setInput(e.target.value)}/>
        </div>
        <img src={addMode ? "./minus.png" : "./plus.png"}
        alt="" className="add"
        onClick={() => SetAddMode(prev => !prev)}
        />
        
    </div>

      {filteredChats.map((chat) => ( // We can use this chat to get the items in the chat array.
      // now the chat layout:{
          // chatId
          // lastMessage
          // receiverId
          // updatedAt
          // user:{...}
      // }
      <div className="item" 
      key={chat.chatId} 
      onClick={() => handleSelect(chat)}
      style={{
        backgroundColor: !chat.isSeen&&(user?.id !== chat?.user?.id) ? "#5183fe" : "transparent",
      }}
      >
        <img src={chat.user.avatar // avatar won't be null if user don't upload img. It'll be default one
          || "./avatar.png"} alt="" /> 
        <div className="texts">
          <span>{chat.user.username}</span>
          <p>{chat.lastMessage}</p>
        </div>
      </div>
      ))}
      {addMode && <AddUser/>}
    </div>
  );
};

export default ChatList