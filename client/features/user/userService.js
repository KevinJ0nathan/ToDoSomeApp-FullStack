import axios from '../../src/axiosConfig';

const API_URL = '/service/user';

// Get user info
const getUserInfo = async () => {
    const response = await axios.get(API_URL + '/user-infor');
    return response.data;
};

const userService = {
    getUserInfo
};

export default userService; 