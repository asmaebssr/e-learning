import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileImage } from 'lucide-react';
import { motion } from 'framer-motion';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    text: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { title, text } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = e => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setImage(null);
      setImagePreview('');
      return;
    }
    
    // Check file type
    if (!selectedFile.type.match(/image.*/)) {
      setError('Please select an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setImage(selectedFile);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validation
    if (text.trim() === '') {
      return setError('Post content is required');
    }
    
    try {
      setLoading(true);
      
      // Create FormData object for multipart/form-data (required for file uploads)
      const postData = new FormData();
      postData.append('title', title);
      postData.append('text', text);
      if (image) {
        postData.append('image', image);
      }
      
      await axios.post('http://localhost:5000/api/posts/create-post', postData, 
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });     

      // Reset form after successful submission
      setFormData({ title: '', text: '' });
      setImage(null);
      setImagePreview('');
      setSuccess(true);
      
      // Navigate to blog after successful post
      setTimeout(() => {
        navigate('/blog');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating post');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen py-10 px-4">
      <motion.div 
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">
          Create a New Post
        </h2>
        
        {success && (
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg mb-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Post created successfully! Redirecting...
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{error}</p>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-indigo-800 font-medium mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="Add a title to your post"
              className="w-full border border-indigo-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="text" className="block text-indigo-800 font-medium mb-2">
              Post Content*
            </label>
            <textarea
              id="text"
              name="text"
              value={text}
              onChange={handleChange}
              placeholder="What's on your mind?"
              rows="5"
              required
              className="w-full border border-indigo-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-indigo-800 font-medium mb-2">
              Upload Image (Optional)
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-indigo-200 rounded-lg p-6 text-center cursor-pointer hover:bg-indigo-50 transition-colors">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer">
                  <FileImage className="w-12 h-12 mx-auto text-indigo-400 mb-2" />
                  <p className="text-indigo-600 font-medium">Click to upload an image</p>
                  <p className="text-gray-500 text-sm mt-1">PNG, JPG or GIF (max 5MB)</p>
                </label>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition-colors"
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-3"></div>
                Creating Post...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Create Post
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;