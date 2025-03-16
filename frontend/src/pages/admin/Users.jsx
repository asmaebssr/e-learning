import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Trash2, AlertCircle, X, Check, User, Mail, ShieldCheck, Loader2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(null);
  const [updatingAdminStatus, setUpdatingAdminStatus] = useState(null); // Track admin status updates

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/users/allUsers", {
          withCredentials: true,
        });
        // Ensure isAdmin is properly displayed (convert to boolean if needed)
        const processedUsers = response.data.map((user) => ({
          ...user,
          isAdmin: typeof user.isAdmin === 'boolean' ? user.isAdmin : Boolean(user.isAdmin),
        }));
        setUsers(processedUsers);
        console.log("Processed users:", processedUsers);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const initiateDelete = (id) => {
    setConfirmDelete(id);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleDelete = async (id) => {
    try {
      setDeleteInProgress(id);
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
    } finally {
      setDeleteInProgress(null);
      setConfirmDelete(null);
    }
  };

  // Toggle admin status
  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      setUpdatingAdminStatus(userId); // Set loading state for the specific user
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/toggle-admin`,
        { isAdmin: !currentStatus },
        { withCredentials: true }
      );

      // Update the user's isAdmin status in the UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: !currentStatus } : user
        )
      );
    } catch (err) {
      console.error('Error toggling admin status:', err);
      setError('Failed to update admin status. Please try again.');
    } finally {
      setUpdatingAdminStatus(null); // Reset loading state
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-indigo-700">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto relative">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-indigo-800 bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
            User Management
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {confirmDelete && (
          <>
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm User Deletion</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDelete)}
                    disabled={deleteInProgress === confirmDelete}
                    className={`px-4 py-2 rounded-md text-white transition-colors ${
                      deleteInProgress === confirmDelete
                        ? "bg-purple-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {deleteInProgress === confirmDelete ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-indigo-100">
            <p className="text-indigo-600">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        Username
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        Email
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} />
                        Admin Status
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-indigo-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleAdminStatus(user._id, user.isAdmin)}
                          disabled={updatingAdminStatus === user._id}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            user.isAdmin
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {updatingAdminStatus === user._id ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : user.isAdmin ? (
                            <>
                              <Check size={14} className="mr-1" /> Admin
                            </>
                          ) : (
                            <>
                              <X size={14} className="mr-1" /> User
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => initiateDelete(user._id)}
                          className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-100 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;