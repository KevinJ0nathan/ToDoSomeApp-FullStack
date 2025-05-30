import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp } from '../../features/auth/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';
import { toast } from 'react-hot-toast';

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, isError, message, isSuccess } = useSelector((state) => state.auth);

    // Get email from location state if coming from login
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await dispatch(verifyOtp({ email, otp })).unwrap();
            toast.success('Email verified successfully!');
            navigate('/signin');
        } catch (error) {
            toast.error(error.message || 'Verification failed');
        }
    };

    const handleResendOtp = async (e) => {
        e.preventDefault();
        try {
            await dispatch(resendOtp({ email })).unwrap();
            toast.success('New OTP sent to your email');
        } catch (error) {
            toast.error(error.message || 'Failed to resend OTP');
        }
    };

    return (
        <>
            <NavbarComponent />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-lg text-green-800 font-semibold mb-4">Verify Your Email</h1>
                {isError && <p className="text-red-500">{message}</p>}
                <form className="flex flex-col gap-3 w-80" onSubmit={handleVerifyOtp}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border p-2 rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="border p-2 rounded-md"
                    />
                    <button type="submit" disabled={isLoading} className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition">
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
                <button 
                    onClick={handleResendOtp} 
                    disabled={isLoading} 
                    className="mt-4 text-green-600 hover:underline"
                >
                    Resend OTP
                </button>
            </div>
        </>
    );
};

export default OtpVerification; 