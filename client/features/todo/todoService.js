import axios from '../../src/axiosConfig';

const API_URL = 'http://localhost:5000/service/todo';

// Get all todos
const getAllTodos = async () => {
    const response = await axios.get(API_URL + '/get_all');
    return response.data;
};

// Add a new todo
const addTodo = async (todoData) => {
    const response = await axios.post(API_URL + '/add_todo', todoData);
    return response.data;
};

// Update a todo
const updateTodo = async (id, todoData) => {
    const response = await axios.patch(API_URL + '/update_todo/' + id, todoData);
    return response.data;
};

// Delete a todo
const deleteTodo = async (id) => {
    const response = await axios.delete(API_URL + '/delete_todo/' + id);
    return response.data;
};

const todoService = {
    getAllTodos,
    addTodo,
    updateTodo,
    deleteTodo
};

export default todoService; 