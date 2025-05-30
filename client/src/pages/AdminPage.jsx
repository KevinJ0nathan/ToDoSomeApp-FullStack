import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, updateUser, deleteUser } from '../features/userSlice';
import NavbarComponent from '../components/NavbarComponent';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const dispatch = useDispatch();
  const { users, isLoading, isError, message } = useSelector((state) => state.user);
  const { user: authData } = useSelector((state) => state.auth);
  const user = authData?.user; // Access the nested user object
  
  console.log('Current user data:', user);
  console.log('User role:', user?.role);
  console.log('Is admin check:', user?.role === 'admin');

  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    address: '',
    phone_number: '',
    role: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(getAllUsers());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      address: user.address || '',
      phone_number: user.phone_number || '',
      role: user.role || 'user'
    });
    document.getElementById('edit-modal').showModal();
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      await dispatch(updateUser({ id: selectedUser._id, userData: editForm })).unwrap();
      toast.success('User updated successfully');
      document.getElementById('edit-modal').close();
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <>
      <NavbarComponent />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-green-800 mb-6">User Management</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner text-success loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address || '-'}</td>
                    <td>{user.phone_number || '-'}</td>
                    <td>{user.role || 'user'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn btn-sm btn-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="btn btn-sm btn-error"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        <dialog id="edit-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Address</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Role</label>
                <select
                  className="select select-bordered w-full"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleUpdate}>
                Save Changes
              </button>
              <button
                className="btn"
                onClick={() => document.getElementById('edit-modal').close()}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default AdminPage; 