import React from 'react';
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { MdCheckCircle, MdError } from "react-icons/md";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate password
    if (!password || password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `http://localhost:5000/api/users/reset-password/${token}`,
        { password }
      );
      setSuccessMessage(response.data.message || "Password reset successfully.");
      setPassword(""); // Clear the password field
      setConfirmPassword(""); // Clear the confirm password field

        navigate("/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Failed to reset password. Please try again.");
      } else if (error.request) {
        setErrorMessage("Unable to connect to the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6 text-blue-600">
          <FiLock size={50} />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Reset Password</h2>
  
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 flex items-center text-red-500 text-center">
            <MdError size={20} className="mr-2" />
            {errorMessage}
          </div>
        )}
  
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 flex items-center text-blue-600 text-center">
            <MdCheckCircle size={20} className="mr-2" />
            {successMessage}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Input */}
          <div className="flex flex-col">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter your new password"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
  
          {/* Confirm Password Input */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                placeholder="Confirm your new password"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
  
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
