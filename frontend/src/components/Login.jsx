import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const data = { email, username, password };

    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/login', data, {
        withCredentials: true // Ensures cookies are sent and received
      });

      if (response.status === 200) {
        // console.log("Login successful");
        // console.log("Full Response:", response.data); // Log the full response data
        const { accessToken } = response.data; // Access the accessToken from response body
        // console.log("Access Token:", accessToken);

        // Store accessToken in localStorage
        if (accessToken) {
          localStorage.setItem('accessToken', "Bearer" + " " + accessToken);
        }

        navigate('/home'); // Redirect to home on successful login
      }
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
    }
  }

  return (
    <form onSubmit={handleLogin}>
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
      <button type="submit">Submit</button>
    </form>
  );
}

export default Login;
