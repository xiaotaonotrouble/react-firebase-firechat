import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "./login.css";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../lib/firebase.js";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload.js";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file:null,
    url:""
  })

  const [loading, setLoading] = useState(false);      // this loading is to disable the button

  useEffect(() => {
    // 当组件挂载时，尝试加载默认图像并创建一个File对象
    fetch("./avatar.png")
      .then(response => response.blob())
      .then(blob => {
        const defaultFile = new File([blob], "./avatar.png", { type: blob.type });
        setAvatar(prev => ({
          ...prev,
          file: defaultFile, // 设置默认的File对象
          
        }));
      })
      .catch(err => console.error('Failed to load default avatar', err));
  }, ["./avatar.png"]);

  const handleAvatar = e =>{
    if (e.target.files[0]){
      setAvatar({
      file:e.target.files[0],
      url:URL.createObjectURL(e.target.files[0])
    })
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    try {
      
      const res = await createUserWithEmailAndPassword(auth, email, password)

      const imgUrl = await upload(avatar.file)

      // Add a new user info in collection "users"
      await setDoc(doc(db, "user", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      // Initialize his chats. Initially empty
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: []
      });


      toast.success("Account created! You can login now!")

    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
    finally{
      setLoading(false);
    }
    await auth.signOut(); // prevent auto login. Important!!! await
    console.log("User signed out after registration");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { email, password } = Object.fromEntries(formData);
    try {
      
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Success!")


    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
    finally{
      setLoading(false);
    }
  };
  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email"/>
          <input type="password" placeholder="Password" name="password"/>
          <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account,</h2>
        <form onSubmit={handleRegister} >
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an image
          </label>
          <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar}/>
          <input type="text" placeholder="Username" name="username"/>
          <input type="text" placeholder="Email" name="email"/>
          <input type="password" placeholder="Password" name="password"/>
          <button disabled={loading } onClick={()=>auth.signOut()}>{loading ? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  )
}

export default Login