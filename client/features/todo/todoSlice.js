import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import todoService from './todoService';

const initialState = {
    todos: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

// Get all todos
export const getAllTodos = createAsyncThunk('todo/getAllTodos', async (_, thunkAPI) => {
    try {
        return await todoService.getAllTodos();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Add a new todo
export const addTodo = createAsyncThunk('todo/addTodo', async (todoData, thunkAPI) => {
    try {
        return await todoService.addTodo(todoData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update a todo
export const updateTodo = createAsyncThunk('todo/updateTodo', async ({ id, todoData }, thunkAPI) => {
    try {
        return await todoService.updateTodo(id, todoData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete a todo
export const deleteTodo = createAsyncThunk('todo/deleteTodo', async (id, thunkAPI) => {
    try {
        return await todoService.deleteTodo(id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        reset: (state) => {
            state.todos = [];
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
            // Get all todos
            .addCase(getAllTodos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.todos = action.payload;
            })
            .addCase(getAllTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Add todo
            .addCase(addTodo.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Support both { newTodo: {...} } and direct todo object
                const newTodo = action.payload.newTodo || action.payload;
                state.todos.push(newTodo);
            })
            .addCase(addTodo.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update todo
            .addCase(updateTodo.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Support both { updatedTodo: {...} } and direct todo object
                const updated = action.payload.updatedTodo || action.payload;
                const index = state.todos.findIndex(todo => todo._id === updated._id);
                if (index !== -1) {
                    state.todos[index] = updated;
                }
            })
            .addCase(updateTodo.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete todo
            .addCase(deleteTodo.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Support both { id: ... } and fallback to action.meta.arg
                const deletedId = action.payload.id || action.meta.arg;
                state.todos = state.todos.filter(todo => todo._id !== deletedId);
            })
            .addCase(deleteTodo.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = todoSlice.actions;
export default todoSlice.reducer; 