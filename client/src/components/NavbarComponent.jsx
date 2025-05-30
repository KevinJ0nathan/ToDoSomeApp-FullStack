import React from "react";
import LogoImg from "../assets/logo.png";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <nav className="flex w-full justify-between items-center bg-green-100 shadow-md py-3 px-10">
      {/* Logo */}
      <Link to="/">
        <div className="flex gap-1 justify-center items-center cursor-pointer">
          <img src={LogoImg} alt="logo-image" className="h-6 w-6" />
          <p className="text-lg font-semibold text-green-600 hover:text-green-700 transition ease-in-out">
            ToDoSome
          </p>
        </div>
      </Link>

      {/* Navigation Menu */}
      <div className="flex gap-6 justify-center items-center text-green-900 font-semibold">
        {user && (
          <Link to="/" className="text-sm hover:text-green-700">
            My ToDo
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className="text-sm hover:text-green-700">
            Admin Panel
          </Link>
        )}
        {user ? (
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user?.photoURL}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center font-semibold">
                {(user.email && user.email.charAt(0).toUpperCase()) || "U"}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white text-sm py-2 px-4 rounded-md hover:bg-red-500 transition ease-in-out"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/signin"
              className="bg-green-800 text-white text-sm py-2 px-6 rounded-md hover:bg-green-700 transition ease-in-out"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-800 text-white text-sm py-2 px-6 rounded-md hover:bg-green-700 transition ease-in-out"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavbarComponent;
