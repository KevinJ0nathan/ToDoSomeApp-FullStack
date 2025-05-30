import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import todoReducer from '../../features/todo/todoSlice';
import userReducer from '../features/userSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        todo: todoReducer,
        user: userReducer
    },
    devTools: import.meta.env.MODE !== 'production'
});
