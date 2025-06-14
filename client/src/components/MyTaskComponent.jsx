import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllTodos, deleteTodo, updateTodo } from "../../features/todo/todoSlice";

const MyTaskComponent = () => {
  const dispatch = useDispatch();
  const { todos, isLoading } = useSelector((state) => state.todo);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  useEffect(() => {
    dispatch(getAllTodos());
  }, [dispatch]);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.todo_name);
    setUpdatedDescription(task.todo_desc);
    document.getElementById("update-modal").showModal();
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    dispatch(updateTodo({ 
      id: selectedTask._id, 
      todoData: { 
        todo_name: updatedTitle, 
        todo_desc: updatedDescription,
        todo_image: selectedTask.todo_image,
        todo_status: selectedTask.todo_status
      } 
    }));
    document.getElementById("update-modal").close();
  };

  const handleDelete = async (taskId) => {
    dispatch(deleteTodo(taskId));
  };

  return (
    <div>
      {isLoading && <p className="text-gray-600">Loading tasks...</p>}

      {!isLoading && todos.length === 0 && (
        <p className="text-gray-500">No tasks available.</p>
      )}

      {!isLoading &&
        todos.map((task) => (
          <div
            key={task._id}
            className="flex flex-col gap-2 mt-2 p-3 text-white bg-green-700 rounded-md shadow-md"
          >
            <h1 className="text-xl font-semibold mb-2">{task.todo_name}</h1>
            <p className="text-sm text-gray-100">{task.todo_desc}</p>

            <div className="flex w-full justify-end items-center gap-4 mt-4">
              <button
                className="btn btn-primary text-white flex gap-1 px-3"
                onClick={() => handleEdit(task)}
              >
                <FaRegEdit className="text-base" />
                Edit
              </button>

              <button
                className="btn btn-error bg-red-600 text-white flex gap-1 px-3"
                onClick={() => handleDelete(task._id)}
              >
                <MdDeleteOutline className="text-lg" />
                Delete
              </button>
            </div>
          </div>
        ))}

      {/* Modal Popup for Update Task (DaisyUI component) */}
      <dialog id="update-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Task</h3>
          <div className="py-4">
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />

            <label className="block text-gray-700 font-medium mt-3">
              Description
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-action">
            <button
              className="btn btn-primary text-white"
              onClick={handleUpdateTask}
            >
              Save Changes
            </button>
            <button
              className="btn"
              onClick={() => document.getElementById("update-modal").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyTaskComponent;
