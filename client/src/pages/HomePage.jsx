import React from "react";
import { Link } from "react-router-dom";
import AddTaskComponent from "../components/AddTaskComponent";
import MyTaskComponent from "../components/MyTaskComponent";
import NavbarComponent from "../components/NavbarComponent";
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <NavbarComponent />
      <div className="h-full">
        {!user ? (
          <>
            <div className="flex flex-col items-center justify-center h-screen">
            <p className="mb-4">Please sign in or sign up to continue.</p>
            <div className="flex gap-4">
              <Link to="/signin" className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition">Sign In</Link>
              <Link to="/signup" className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition">Sign Up</Link>
            </div>
            </div>
          </>
        ) : (
          <div className="flex w-full h-full gap-8 py-6 px-6">
            <AddTaskComponent />
            <div className="flex flex-col gap-3 flex-3/4 bg-green-100 rounded-md p-4">
              <h1 className="text-green-900 font-semibold text-lg">My Tasks</h1>
              <MyTaskComponent />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
