import "./Navbar.css";

const Navbar = ({ onLoginClick, isLoggedIn, handleLogout }) => {

  return (

    <div className="navbar">

      <div className="logo">
        Right Choice Drycleaners
      </div>

      <div className="nav-right">

        {isLoggedIn ? (

          <button
            className="nav-btn logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        ) : (

          <button
            className="nav-btn"
            onClick={onLoginClick}
          >
            Login
          </button>

        )}

      </div>

    </div>

  );

};

export default Navbar;