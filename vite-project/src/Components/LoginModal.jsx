import { useState } from "react";
import axios from "axios";
import "./LoginModal.css";

const LoginModal = ({ closeModal, setIsLoggedIn }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {
      console.log(email, password);
      

      const res = await axios.post(
        "https://bill-management-backend-1-1gij.onrender.com/api/auth/login",
        {
          email,
          password
        }
      );

      console.log(res.data);
      

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(res.data.admin)
      );

      setIsLoggedIn(true);

      alert("Login success ✅");

      closeModal();

    } catch (error) {

      console.log(error.response.data);

      alert("Invalid credentials ❌");

    }

  };

 return (

  <div className="login-overlay">

    <div className="login-modal">

      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <div className="login-buttons">

        <button
          className="login-btn"
          onClick={handleLogin}
        >
          Login
        </button>

        <button
          className="close-btn"
          onClick={closeModal}
        >
          Close
        </button>

      </div>

    </div>

  </div>

);
}

export default LoginModal;