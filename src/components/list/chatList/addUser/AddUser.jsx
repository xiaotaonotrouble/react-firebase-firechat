/* This is the component for adding user functionality */


import { useState } from "react";
import { db } from "../../../../lib/firebase";
import "./addUser.css"
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null)
  const {currentUser} = useUserStore()

  const handleSearch = async (e) => { // async because we are querying the database (find a user by his name)
    e.preventDefault() // Otherwise it's gonna refresh the page
    // We collect the form data, exactly how we do in handleLogin and handleRegister
    const formData = new FormData(e.target)
    const username = formData.get("username")

    try {
      
      const userRef = collection(db, "user"); // just like Doc(), return a reference, no database interaction involved

      // Create a query against the collection.
      const q = query(userRef, where("username", "==", username)); // also, a kind of reference to query

      const querySnapShot = await getDocs(q) // this actually performs the query

      if(!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data())   // returns an array of docs of that snapshot, each doc has data and mata data. to get data, use .data(), to get metadata, just retrive.  
      }

    } catch (err) {
      console.log(err)
    }
  }

  const handleAdd = async () => { // of course it's gonna be an async function
    
    const chatRef = collection(db, "chats")  // will return a reference to "chats" collection. It will not create an empty chats collection. Creation of collection is done on write
    const userChatRef = collection(db, "userchats")  // this collection already exists
    
    try {
      const newChatRef = doc(chatRef) // using this reference, we can later get the chat's id
      
      await setDoc(newChatRef, { // create a new chat element between me and this friend in chats collection. And also, for the first time, create the "chats" collection
        // setDoc() will insert an entry in the collection, and this entry has an ID associated with it(not a field in the entry, but an attribute of this entry!)
        createdAt: serverTimestamp(),
        messages: []              // this is where all the chat messages reside.
      }) 

      // update both user's and currentUser's "userchats"
                    // {
                    //   chatId
                    //   lastMessage
                    //   receiverId
                    //   updatedAt
                    // }
      updateDoc(doc(userChatRef, user.id), {    
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),  // This is client side time.
        })
      })

      updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),  // This is client side time.
        })
      })

      console.log(newChatRef.id)
    } catch (err) {
      console.log(err)
    }
    
    

  }

  return (
    <div className='AddUser'>
        <form onSubmit={handleSearch}>
            <input type="text" placeholder="Username" name="username" />
            <button>Search</button>
        </form>
        {user && <div className="user">
            <div className="detail">
                <img src={user.avatar} alt="" />
                <span>{user.username}</span>
            </div>
            <button onClick={handleAdd}>Add User</button>
        </div>}
    </div>
  )
}

export default AddUser