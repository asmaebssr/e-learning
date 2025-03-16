import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Grid, List, Trash2, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { motion } from 'framer-motion'; // Added framer-motion import

const AllCommunities = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    communityId: null
  });
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:5000/api/communities/subcategories', 
          { withCredentials: true }
        );
        setSubcategories(response.data);
      } catch (err) {
        setError('Failed to load communities. Please try again later.');
        console.error('Error fetching subcategories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  // Show delete confirmation modal
  const showDeleteConfirmation = (id) => {
    setDeleteModal({
      show: true,
      communityId: id
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      communityId: null
    });
  };

  // Handle community deletion
  const handleDeleteCommunity = async () => {
    try {
      setDeleteInProgress(true);
      await axios.delete(`http://localhost:5000/api/communities/subcategory/${deleteModal.communityId}`, {
        withCredentials: true,
      });

      // Remove the deleted community from the UI
      setSubcategories(subcategories.filter((subcategory) => subcategory._id !== deleteModal.communityId));
      setDeleteInProgress(false);
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting community:", err);
      setError("Failed to delete community");
      setDeleteInProgress(false);
      closeDeleteModal();
    }
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <AdminSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-indigo-500"></div>
            <p className="text-indigo-600 mt-4 font-medium">Loading communities...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <AdminSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl border border-red-200 text-center max-w-lg shadow-lg">
            <p className="text-red-600 mb-4 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <header>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">
              All Communities
            </h1>
          </header>

          <div className="flex items-center space-x-3 bg-white rounded-lg p-1 shadow-md">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
              aria-label="Grid view"
              title="Grid view"
            >
              <Grid className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
              aria-label="List view"
              title="List view"
            >
              <List className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {subcategories.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-indigo-500">
            <p className="text-gray-600 mb-4 font-medium">No communities available at the moment.</p>
            <p className="text-sm text-indigo-500">Check back later for new content!</p>
          </div>
        ) : (
          <div className="mb-14">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subcategories.map((subcategory) => (
                  <motion.div
                    key={subcategory._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 border-t-4 border-indigo-500 h-full flex flex-col"
                  >
                    {subcategory.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={`http://localhost:5000${subcategory.imageUrl}`} 
                          alt={subcategory.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-indigo-800">{subcategory.name}</h3>
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                          {subcategory.membersCount || 0} members
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-6 leading-relaxed">{subcategory.description}</p>
                    </div>

                    <div className="flex justify-end p-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => showDeleteConfirmation(subcategory._id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {subcategories.map((subcategory) => (
                  <motion.div
                    key={subcategory._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -3, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 border-t-4 border-indigo-500 max-w-2xl mx-auto"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-indigo-800">{subcategory.name}</h3>
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                          {subcategory.membersCount || 0} members
                        </span>
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed">{subcategory.description}</p>
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => showDeleteConfirmation(subcategory._id)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Delete Confirmation Modal with Animation */}
        {deleteModal.show && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              onClick={closeDeleteModal}
            ></motion.div>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    onClick={closeDeleteModal}
                    className="text-white hover:text-indigo-100 bg-white/10 p-1 rounded-full hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this community? This action cannot be undone and all community posts and discussions will be permanently removed.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeDeleteModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeleteCommunity}
                      disabled={deleteInProgress}
                      className={`px-4 py-2 rounded-lg text-white transition-colors ${
                        deleteInProgress
                          ? "bg-indigo-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      }`}
                    >
                      {deleteInProgress ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </div>
                      ) : (
                        "Delete Community"
                      )}
                    </motion.button>                  
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllCommunities;