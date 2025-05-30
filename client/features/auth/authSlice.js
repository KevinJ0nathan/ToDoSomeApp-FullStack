import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    isLoggedOut: user ? false : true,
    message: ""
}

// signin user
export const signin = createAsyncThunk('auth/signin', async (user, thunkAPI) => {
    try {
        return await authService.signin(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// signup user
export const signup = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
    try {
        return await authService.signup(userData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// verify OTP
export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (otpData, thunkAPI) => {
    try {
        return await authService.verifyOtp(otpData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// resend OTP
export const resendOtp = createAsyncThunk('auth/resendOtp', async (emailData, thunkAPI) => {
    try {
        return await authService.resendOtp(emailData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// logout user
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        authService.logout();
        return null;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.user = null
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            // signin builder
            .addCase(signin.pending, (state) => {
                state.isLoading = true
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isLoggedOut = false
                state.user = action.payload
            })
            .addCase(signin.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // signup builder
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signup.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // verifyOtp builder
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // resendOtp builder
            .addCase(resendOtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resendOtp.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // logout builder
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isLoggedOut = true;
            });
    }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;