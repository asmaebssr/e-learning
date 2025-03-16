import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Trash2, AlertCircle, X, Edit, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AllPaths = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "http://localhost:5000/api/users/learning-paths",
        { withCredentials: true }
      );
      setPaths(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load learning paths");
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (id) => {
    setConfirmDelete(id);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleDelete = async (id) => {
    try {
      setDeleteInProgress(id);
      await axios.delete(`http://localhost:5000/api/learning-paths/${id}`, 
        { withCredentials: true });
      setPaths(paths.filter(path => path._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete the path");
    } finally {
      setDeleteInProgress(null);
      setConfirmDelete(null);
    }
  };

  const handleModify = (id) => {
    navigate(`/modify-path/${id}`);
  };

  const handleCreateNew = () => {
    navigate('/admin/learning-paths/create');
  };

  const filteredPaths = paths.filter(path => {
    const matchesSearch = path.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        path.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory ? path.category === filterCategory : true;
    return matchesSearch && matchesFilter;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(paths.map(path => path.category))];

  if (loading && paths.length === 0) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-t-indigo-600 border-indigo-200 rounded-full mx-auto mb-4"
            ></motion.div>
            <p className="text-indigo-700">Loading learning paths...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <h1 className="text-3xl font-bold text-indigo-800 bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
            Learning Paths
          </h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNew}
                className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg"
              >
                <Plus size={18} />
                Create New
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchPaths}
                className="p-2 rounded-lg flex items-center justify-center bg-white border border-gray-300 text-indigo-700 hover:bg-gray-50"
                title="Refresh paths"
              >
                <RefreshCw size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md flex items-center gap-2"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-red-700 hover:text-red-900"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        {confirmDelete && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={cancelDelete}
            ></motion.div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-lg p-6 max-w-md shadow-xl"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this learning path? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelDelete}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(confirmDelete)}
                    disabled={deleteInProgress === confirmDelete}
                    className={`px-4 py-2 rounded-md text-white transition-colors ${
                      deleteInProgress === confirmDelete
                        ? "bg-purple-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {deleteInProgress === confirmDelete ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </div>
                    ) : (
                      "Delete"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {filteredPaths.length === 0 && !loading ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-lg shadow border border-indigo-100"
          >
            <p className="text-indigo-600 mb-4">No learning paths found</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNew}
              className="px-4 py-2 rounded-lg flex items-center gap-2 bg-indigo-600 text-white mx-auto"
            >
              <Plus size={18} />
              Create a path
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPaths.map((path, index) => (
              <motion.div 
                key={path._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-indigo-500"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full mb-2">
                      {path.category}
                    </span>
                    <h2 className="text-xl font-semibold text-indigo-900">{path.subcategory}</h2>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleModify(path._id)}
                      className="flex-1 px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm"
                    >
                      <Edit size={16} />
                      Modify
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => initiateDelete(path._id)}
                      className="flex-1 px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllPaths;