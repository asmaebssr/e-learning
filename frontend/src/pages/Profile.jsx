import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../toolkit/features/auth/authSlice';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const Profile = () => {
  const userData = useSelector((state) => state.auth.user.user);
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when Redux user data changes
  useEffect(() => {
    // Check if userData exists
    if (userData) {
      setUser(prevUser => ({
        ...prevUser,
        username: userData.username || '',
        email: userData.email || '',
        password: '',
        confirmPassword: '',
      }));
    }
  }, [userData]);

  // Load user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Only make this request if we don't already have the user data
        if (!userData) {
          setIsLoading(true);
          const res = await axios.get(
            'http://localhost:5000/api/users/get-user',
            { withCredentials: true }
          );
          
          // Update Redux store with fetched data
          dispatch(updateUser(res.data));
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!user.username || !user.email) {
      setError('Username and email are required.');
      return false;
    }
    if (user.password && user.password !== user.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { username, email, password } = user;

      const res = await axios.post(
        'http://localhost:5000/api/users/update-user',
        { username, email, password },
        { withCredentials: true }
      );

      dispatch(updateUser(res.data));
      setMessage('Profile updated successfully!');
      
      // Clear password fields after successful update
      setUser(prevUser => ({
        ...prevUser,
        password: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user.username) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen py-10">
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border-t-4 border-indigo-500">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="mt-4 text-lg text-gray-700">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Profile
        </motion.h1>
        
        <motion.div 
          className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-indigo-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-indigo-800">Account Information</h2>
            
            {message && (
              <motion.div 
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg mb-6 flex items-center"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                <p>{message}</p>
              </motion.div>
            )}
            
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg mb-6 flex items-center"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>{error}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={user.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className={`flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium py-3 px-6 rounded-lg ${
                  isLoading 
                    ? 'opacity-75 cursor-not-allowed'
                    : 'hover:from-purple-600 hover:to-indigo-600'
                } transition-all duration-300 w-full`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;