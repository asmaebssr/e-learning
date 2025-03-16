import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset status before submitting
    setStatus({ submitting: true, success: false, error: null });
    
    try {
      // Send contact form data to your backend API
      const response = await axios.post('http://localhost:5000/api/users/contact', formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setStatus({
          submitting: false,
          success: true,
          error: null
        });
        
        // Reset form after successful submission
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus({
        submitting: false,
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to send message'
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen py-10">
      {/* Header */}
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h1>
        
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-lg text-gray-700">
            We're here to help and answer any questions you might have
          </p>
        </motion.div>

        {/* Contact Card */}
        <motion.div 
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-indigo-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Contact Form */}
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-indigo-800">Send Us a Message</h3>
            <p className="text-gray-600 mb-8">Feel free to reach out to us with any questions or inquiries. We're here to help!</p>
            
            {status.success && (
              <motion.div 
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg mb-6 flex items-center"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                <p>Thank you for your message! We will get back to you soon.</p>
              </motion.div>
            )}
            
            {status.error && (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg mb-6 flex items-center"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>Error: {status.error}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="John Doe" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="john@example.com" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-36" 
                  placeholder="Tell us what you need help with..." 
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className={`flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium py-3 px-6 rounded-lg ${
                  status.submitting 
                    ? 'opacity-75 cursor-not-allowed'
                    : 'hover:from-purple-600 hover:to-indigo-600'
                } transition-all duration-300 w-full`}
                disabled={status.submitting}
              >
                {status.submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
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

export default Contact;