import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

// Get all users (admin only)
export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/service/user/all-users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user (admin only)
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/service/user/update-user/${id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete user (admin only)
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/service/user/delete-user/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  users: [],
  isLoading: false,
  isError: false,
  message: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || 'Failed to fetch users';
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || 'Failed to update user';
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user._id !== action.payload._id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || 'Failed to delete user';
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer; 