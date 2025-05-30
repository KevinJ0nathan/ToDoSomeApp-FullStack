import axios from '../../src/axiosConfig';

const API_URL = '/service/user';

// signin user
const signin = async (userData) => {
    const response = await axios.post(API_URL + "/signin", userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
}

// signup user
const signup = async (userData) => {
    const response = await axios.post(API_URL + "/signup", userData);
    return response.data;
};

// verify OTP
const verifyOtp = async (otpData) => {
    const response = await axios.post(API_URL + "/verify-otp", otpData);
    return response.data;
};

// resend OTP
const resendOtp = async (emailData) => {
    const response = await axios.post(API_URL + "/resend-otp", emailData);
    return response.data;
};

// logout user
const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    signin,
    signup,
    verifyOtp,
    resendOtp,
    logout
};

export default authService;