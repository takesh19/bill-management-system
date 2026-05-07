import React, {useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Billing from "./pages/Billing";
import Revenue from "./pages/Sales/Revenue";
import Bills from "./pages/Sales/Bills";

function App() {

  const token = localStorage.getItem("token");

  const [showLogin, setShowLogin] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
  );

  const handleLogout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("admin");

  setIsLoggedIn(false);

  };

  return (
    <BrowserRouter>

      <Navbar
        onLoginClick={() => setShowLogin(true)}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />

      <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>

        {/* Sidebar */}
        <div style={{ width: "220px", background: "#0f172a", color: "white" }}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            width: "100%",
            padding: window.innerWidth <= 768 ? "80px 12px 20px" : "20px",
            background: "#f1f5f9",
            marginTop: window.innerWidth <= 768 ? "60px" : "0",
            transition: "0.3s",
           }}
          >
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/customers"
              element={<Customers />}
            />

            <Route
              path="/items"
              element={<Items />}
            /> 

            <Route
              path="/billing"
              element={<Billing />}
            />
            <Route 
              path="/sales/revenue" 
              element={<Revenue />}
              />

            <Route 
            path="/sales/bills" 
            element={<Bills />} 
            />
            <Route 
            path="/bill/:id" 
            element={token ? <Billing /> : <div style={{padding:"20px"}}>Login Required 🔒</div>} 
            />
          </Routes>
        </div>

      </div>

      {showLogin && (
      <LoginModal
        closeModal={() => setShowLogin(false)}
        setIsLoggedIn={setIsLoggedIn}
      />
      )}
    </BrowserRouter>
  );
}

export default App;