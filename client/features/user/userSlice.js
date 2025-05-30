import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

const initialState = {
    userInfo: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

// Get user info
export const getUserInfo = createAsyncThunk('user/getUserInfo', async (_, thunkAPI) => {
    try {
        return await userService.getUserInfo();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => {
            state.userInfo = null;
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserInfo.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.userInfo = action.payload;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = userSlice.actions;
export default userSlice.reducer; 