import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    if (avatar) formData.append('avatar', avatar);
    if (coverImage) formData.append('coverImage', coverImage);
  
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Add this line
      });
  
      if (response.data.statusCode === 200) { // Assuming your API follows this structure
        console.log(response.data.message); // Log the success message
        navigate('/login'); // Redirect to login on successful registration
      }
    } catch (error) {
      console.error("Error during registration:", error.response?.data?.message || error.message);
      // Here you might want to set some state to display the error to the user
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
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
      <input
        type="file"
        placeholder="Avatar"
        onChange={(e) => setAvatar(e.target.files[0])}
      />
      <input
        type="file"
        placeholder="Cover Image"
        onChange={(e) => setCoverImage(e.target.files[0])}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Register;
