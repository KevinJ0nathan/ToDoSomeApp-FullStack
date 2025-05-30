import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import AdminPage from './pages/AdminPage';

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* prevent user after login */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </>
  );
};

export default App;
