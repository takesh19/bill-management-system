import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { useState } from "react";

const Sidebar = () => {

  const location = useLocation();

  const token = localStorage.getItem("token");

  const [openSales, setOpenSales] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <>

      {/* MOBILE TOPBAR */}
      <div className="mobile-topbar">

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <h2>
          {token ? "Right Choice Drycleaners" : "Welcome"}
        </h2>

      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>

        <h2 className="logo">
          {token
            ? "Right Choice DryCleaners"
            : "Welcome"}
        </h2>

        <ul className="menu">

          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">🏠 Dashboard</Link>
          </li>

          <li className={location.pathname === "/customers" ? "active" : ""}>
            <Link to="/customers">👥 Customers</Link>
          </li>

          <li className={location.pathname === "/items" ? "active" : ""}>
            <Link to="/items">📦 Items</Link>
          </li>

          <li className={location.pathname === "/billing" ? "active" : ""}>
            <Link to="/billing">🧾 Billing</Link>
          </li>

          {/* SALES */}
          <li>

            <div
              className="menu-link"
              onClick={() => setOpenSales(!openSales)}
            >
              📊 Sales {openSales ? "▲" : "▼"}
            </div>

            {openSales && (
              <ul className={`submenu ${openSales ? "open" : ""}`}>

                <li className={location.pathname === "/sales/revenue" ? "active" : ""}>
                  <Link to="/sales/revenue">💰 Revenue</Link>
                </li>

                <li className={location.pathname === "/sales/bills" ? "active" : ""}>
                  <Link to="/sales/bills">🧾 Bills</Link>
                </li>

              </ul>
            )}

          </li>

        </ul>

      </div>

    </>

  );

};

export default Sidebar;