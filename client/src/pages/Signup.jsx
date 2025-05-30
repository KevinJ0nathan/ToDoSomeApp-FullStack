import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';

const Signup = () => {
    const [formData, setFormData] = useState({
        personal_id: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phone_number: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isError, message, isSuccess } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signup(formData));
    };

    useEffect(() => {
        if (isSuccess) {
            navigate('/verify-otp');
        }
    }, [isSuccess, navigate]);

    return (
        <>
            <NavbarComponent />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-lg text-green-800 font-semibold mb-4">Signup</h1>
                {isError && <p className="text-red-500">{message}</p>}
                <form className="flex flex-col gap-3 w-80" onSubmit={handleSubmit}>
                    <input type="text" name="personal_id" placeholder="Personal ID" onChange={handleChange} required className="border p-2 rounded-md" />
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="border p-2 rounded-md" />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="border p-2 rounded-md" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="border p-2 rounded-md" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="border p-2 rounded-md" />
                    <input type="text" name="address" placeholder="Address" onChange={handleChange} className="border p-2 rounded-md" />
                    <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} className="border p-2 rounded-md" />
                    <button type="submit" disabled={isLoading} className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition">Signup</button>
                </form>
                <p className="mt-4">
                    Already have an account? <Link to="/signin" className="text-green-600 hover:underline">Login here</Link>
                </p>
            </div>
        </>
    );
};

export default Signup; 