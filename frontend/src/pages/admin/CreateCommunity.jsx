// frontend/src/components/CreateCommunity.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const CreateCommunity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, slug, description, image } = formData;

    // Validate required fields
    if (!name || !slug || !description) {
      setError("Name, slug, and description are required");
      return;
    }

    // Prepare form data
    const data = new FormData();
    data.append('name', name);
    data.append('slug', slug);
    data.append('description', description);
    if (image) {
      data.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/communities/subcategory', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage("Community created successfully!");
      setError('');
      setTimeout(() => navigate('/admin/communities/all'), 2000); // Redirect after success
    } catch (err) {
      console.error("Error creating community:", err);
      setError(err.response?.data?.message || "Failed to create community");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Create Community</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter community name"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter community slug"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Describe the community"
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;