import { useState } from 'react'
import axios from 'axios'

function App() {
  // const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  // const [avatar, setAvatar] = useState(null)
  // const [coverImage, setCoverImage] = useState(null)

  // async function handleRegister(e) {
  //   e.preventDefault();
  
  //   // Using FormData to handle file uploads properly
  //   const formData = new FormData();
  //   formData.append('fullName', fullName);
  //   formData.append('email', email);
  //   formData.append('username', username);
  //   formData.append('password', password);
  
  //   // Only append files if they are selected
  //   if (avatar) formData.append('avatar', avatar); 
  //   if (coverImage) formData.append('coverImage', coverImage);
  
  //   try {
  //     const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  
  //     if (response.status === 200) {
  //       console.log("Registration successful");
  //     }
  //   } catch (error) {
  //     console.error("Error during registration:", error.response?.data || error.message);
  //   }
  // }
  
  async function handleLogin(e) {
    e.preventDefault()
    const data = {
      email,
      username,
      password
    }
    try {
      const response = axios.post('http://localhost:8000/api/v1/users/login',data)
      if((await response).status === 200){
        console.log("login successful");
        <h1>login successful!!</h1>
      }
    } catch (error) {
      throw error.message
    }
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        {/* <input 
          type="text" 
          placeholder="Full name" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
        /> */}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        {/* <input 
          type="file" 
          placeholder="Avatar" 
          onChange={(e) => setAvatar(e.target.files[0])} 
        />
        <input 
          type="file" 
          placeholder="Cover Image" 
          onChange={(e) => setCoverImage(e.target.files[0])} 
        /> */}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
