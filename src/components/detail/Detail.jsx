import { signOut } from "firebase/auth"
import "./detail.css"
import { auth, db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"
import { useUserStore } from "../../lib/userStore"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"

const Detail = () => {
  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChatStore} = useChatStore()
  const {currentUser, resetUserStore} = useUserStore()

  const handleBlock = async ()=>{
    if(!user) return;
    const userDocRef = doc(db, "user", currentUser.id)
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      })
      changeBlock()
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = async () => {
    try {
      // 触发 Firebase 的登出逻辑
      await signOut(auth);

      resetUserStore();
      resetChatStore();
      console.log("User successfully logged out.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <div className='detail'>
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <h2>{user?.username}</h2>
            {/* <p>Testing</p> */}
          </div>
        </div>
        <div className="info">
          <div className="option">
            <div className="title">
              <span>Privacy & Help</span>
              <img src="./arrowUp.png" alt="" />
            </div>
          </div>
          
          <div className="option">
            <div className="title">
              <span>Chat Settings</span>
              <img src="./arrowUp.png" alt="" />
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Shared Files</span>
              <img src="./arrowUp.png" alt="" />
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Shared photos</span>
              <img src="./arrowDown.png" alt="" />
            </div>

            <div className="photos">
              <div className="photoItem">
                <div className="photoDetail">
                  <img 
                    src="https://images.pexels.com/photos/27383282/pexels-photo-27383282/free-photo-of-brunette-in-corduroy-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="" 
                  />
                  <span>hotgirl.png</span>
                </div>
                <img src="./download.png" alt="" className="download"/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img 
                    src="https://images.pexels.com/photos/27383282/pexels-photo-27383282/free-photo-of-brunette-in-corduroy-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="" 
                  />
                  <span>hotgirl.png</span>
                </div>
                <img src="./download.png" alt="" className="download"/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img 
                    src="https://images.pexels.com/photos/27383282/pexels-photo-27383282/free-photo-of-brunette-in-corduroy-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="" 
                  />
                  <span>hotgirl.png</span>
                </div>
                <img src="./download.png" alt="" className="download"/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img 
                    src="https://images.pexels.com/photos/27383282/pexels-photo-27383282/free-photo-of-brunette-in-corduroy-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="" 
                  />
                  <span>hotgirl.png</span>
                </div>
                <img src="./download.png" alt="" className="download"/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img 
                    src="https://images.pexels.com/photos/27383282/pexels-photo-27383282/free-photo-of-brunette-in-corduroy-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="" 
                  />
                  <span>hotgirl.png</span>
                </div>
                <img src="./download.png" alt="" className="download"/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img 
                    src="https://images.pexels.com/photos/27383282/pexels-photo-27383282/free-photo-of-brunette-in-corduroy-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="" 
                  />
                  <span>hotgirl.png</span>
                </div>
                <img src="./download.png" alt="" className="download"/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img 
                    src="https://images.pexels.com/photos/27383282/pexels-photo-27383282/free-photo-of-brunette-in-corduroy-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="" 
                  />
                  <span>hotgirl.png</span>
                </div>
                <img src="./download.png" alt="" className="download"/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img 
                    src="https://images.pexels.com/photos/27383282/pexels-photo-27383282/free-photo-of-brunette-in-corduroy-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="" 
                  />
                  <span>hotgirl.png</span>
                </div>
                <img src="./download.png" alt="" className="download"/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img 
                    src="https://images.pexels.com/photos/27383282/pexels-photo-27383282/free-photo-of-brunette-in-corduroy-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="" 
                  />
                  <span>hotgirl.png</span>
                </div>
                <img src="./download.png" alt="" className="download"/>
              </div>
              
            </div>
          </div>

          
        </div>
          
        <div className="buttoncontainer">
          <button onClick={handleBlock}>{
            isCurrentUserBlocked? "You are blocked" : isReceiverBlocked? "User blocked" : "Block User"
          }</button>
          <button className="logout" onClick={handleLogout}>Logout</button>

        </div>

          

        

    </div>
  )
}

export default Detail