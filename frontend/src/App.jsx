import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/Register.jsx';
import LoginPage from './pages/Login.jsx';
import HomePage from './pages/Home.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
