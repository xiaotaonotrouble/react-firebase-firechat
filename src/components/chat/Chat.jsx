import { useEffect, useRef, useState } from "react"
import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { db } from "../../lib/firebase.js";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore.js";
import upload from "../../lib/upload.js";



const Chat = () => {
  const [chat, setChat] = useState();
  const [emojiOpen, setOpen] = useState(false);
  const [text, setText] = useState("");
  const endRef = useRef(null)
  const [img, setImg] = useState({
    file:null,
    url:""
  })

  const { currentUser } = useUserStore();
  const { user, chatId, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  // console.log(user, chatId)


  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior:"smooth"})
  }, [chat?.messages])


  // useEffect(() => {
  //   // 使用 setTimeout 或 requestAnimationFrame 确保只在消息渲染完成后执行一次滚动
  //   const scrollToBottom = () => {
  //     endRef.current?.scrollIntoView({ behavior: "smooth" });
  //   };

  //   // setTimeout(() => {
  //   //   scrollToBottom();
  //   // }, 0);

  //   requestAnimationFrame(() => {
  //     scrollToBottom();
  //   });

  // }, [chat?.messages.length]); 

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res)=>{   // onSnapshot is gonna return a snapshot, using .data() we can fetch the raw data
      setChat(res.data())
    })  // gonna use state tools to fetch chatId dynamically

    return () => {
      unSub();
    };
  }, [chatId]); 

  // now we have a way to fetch the chat of a particular chatId!!! So now what's important is we get the chatId we want.(we can easily get it in chatList component)
  // console.log(chat?.messages);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji)
    setOpen(false)
  };

  const handleSend = async () => {
    if (text === "" && img.file === null) return;

    let imgUrl = null
    let text1 = text
    let img1 = img
    // after sending message, empty text state and img state:
    setImg({
      file:null,
      url:""
    })

    setText("")
  
    try {
      if (img1.file) {
        imgUrl = await upload(img1.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          // This is the layout of a unit of message sent
          senderId: currentUser.id,
          text: text1,
          createdAt: new Date(),
          ...(imgUrl && {img:imgUrl})
        })
      })    // remember, we also need to update userChat to reflect newly-sent message:

      // currentUser's userchats
      const c_userChatsRef = doc(db, "userchats", currentUser.id);
      const c_userChatsSnapshot = await getDoc(c_userChatsRef);
      if (c_userChatsSnapshot.exists()) {
        const c_userChatsData = c_userChatsSnapshot.data();
        const c_chatIndex = c_userChatsData.chats.findIndex(c=>c.chatId === chatId);
        c_userChatsData.chats[c_chatIndex].lastMessage = text1;
        c_userChatsData.chats[c_chatIndex].isSeen = true;
        c_userChatsData.chats[c_chatIndex].updatedAt = Date.now();
      
      await updateDoc(c_userChatsRef, {
        chats: c_userChatsData.chats
      })
    }
      // Also the receiver
      const userChatsRef = doc(db, "userchats", user.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      if (userChatsSnapshot.exists()) {
        const userChatsData = userChatsSnapshot.data();
        const chatIndex = userChatsData.chats.findIndex(c=>c.chatId === chatId);
        userChatsData.chats[chatIndex].lastMessage = text1;
        userChatsData.chats[chatIndex].isSeen = false;
        userChatsData.chats[chatIndex].updatedAt = Date.now();
      
      await updateDoc(userChatsRef, {
        chats: userChatsData.chats
      })
    }
    } catch (err) {
      console.log(err);
    }
  }
  // console.log(img)

  const handleImg = e =>{
    if (e.target.files[0]){
      setImg({
      file:e.target.files[0],
      url:URL.createObjectURL(e.target.files[0])
    })
    }
  }

  // console.log(user)
  // console.log(chatId)
  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            {/* <p>Who are you?</p> */}
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />

        </div>
      </div>


      <div className="center">

      {chat?.messages?.map((message)=>
          (
            <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message?.createdAt}>
              <div className="texts">
                {message.img && <img 
                src={message.img}
                alt="" 
                />}
                {message.text && <p>{message.text}</p>}
                {/* <span>1 minute ago</span> */}
              </div>
            </div>

            // {img.url && <div className="message own">
            //   <div className="texts">
            //     <img src={img.url} alt="" />
            //   </div>
            // </div>
            // }
          )
        )}
        
        

        <div ref = {endRef}></div>

      </div>


      <div className="bottom">
        <div className="icons">
          <label htmlFor="file" 
            style={{
            cursor: isCurrentUserBlocked || isReceiverBlocked ? "not-allowed" : "pointer",
            opacity: isCurrentUserBlocked || isReceiverBlocked ? 0.5 : 1
            }}
          >
            <img src="./img.png" alt="" />
          </label>
         
          <input type="file" id="file" style={{display : "none"}} disabled={isCurrentUserBlocked || isReceiverBlocked} onChange={handleImg}/>
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text"  
          value={text}
          placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : "Type a message..."} 
          onChange={e=>setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={()=>setOpen(prev=>!prev)} 
          style={{
          cursor: isCurrentUserBlocked || isReceiverBlocked ? "not-allowed" : "pointer",
          opacity: isCurrentUserBlocked || isReceiverBlocked ? 0.5 : 1
          }}
          />
          <div className="picker">
            <EmojiPicker open={emojiOpen && !isCurrentUserBlocked && !isReceiverBlocked} onEmojiClick={handleEmoji}/>
          </div>
          
        </div>
        <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>


    </div>
  )
}

export default Chat