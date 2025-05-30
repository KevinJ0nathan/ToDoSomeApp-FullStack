import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NavbarComponent from "../components/NavbarComponent";
import { useDispatch, useSelector } from "react-redux";
import { reset, signin } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isError: "",
    isSuccess: "",
  });
  const { email, password } = formData;

  const { user, isLoading, isError, isSuccess, isLoggedOut, message } =
    useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, isError: "", isSuccess: "" });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const resultAction = await dispatch(signin(userData)).unwrap();
      if (resultAction.needsVerification) {
        navigate('/verify-otp', { state: { email: resultAction.email } });
        toast.error(resultAction.message);
      } else if (resultAction.registrationExpired) {
        toast.error(resultAction.message);
        navigate('/signup');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess && user) {
      toast.success(user.message);
      navigate('/');
    }
  }, [user, isSuccess, isError, message, navigate]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-success loading-lg"></span>
      </div>
    );
  }

  // If user is logged in, redirect to home
  if (user && !isLoggedOut) {
    navigate('/');
    return null;
  }

  return (
    <>
      <NavbarComponent />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-lg text-green-800 font-semibold mb-4">
          Please login!
        </h1>
        <form
          className="flex flex-col gap-3 w-80"
          onSubmit={handleEmailLogin}
        >
          <input
            type="email"
            id="name"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            className="border p-2 rounded-md"
          />
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            className="border p-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;