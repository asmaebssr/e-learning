import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Grid, List } from 'lucide-react';

const SubcategoryList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Sidebar />
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
        <Sidebar />
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
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <header>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">
              Join a Community
            </h1>
            <p className="text-indigo-600 mt-2">Connect with peers and share your knowledge</p>
          </header>

          <div className="flex items-center space-x-3 bg-white rounded-lg p-1 shadow-md">
            <button 
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
            </button>
            <button 
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
            </button>
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
                  <div
                    key={subcategory._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500 h-full flex flex-col"
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
                      {/* <div className="mt-auto">
                        <span className="text-sm text-indigo-600 font-medium">
                          {subcategory.onlineUsers || 0} online now
                        </span>
                      </div> */}
                    </div>

                    <Link
                      to={`/communities/${subcategory.slug}`}
                      className="block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
                    >
                      Join Discussion
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {subcategories.map((subcategory) => (
                  <div
                    key={subcategory._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500 max-w-2xl mx-auto"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-indigo-800">{subcategory.name}</h3>
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                          {subcategory.membersCount || 0} members
                        </span>
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed">{subcategory.description}</p>
                      <div className="flex justify-between items-center">
                        {/* <span className="text-sm text-indigo-600 font-medium">
                          {subcategory.onlineUsers || 0} online now
                        </span> */}
                        <Link
                          to={`/communities/${subcategory.slug}`}
                          className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md font-medium"
                        >
                          Join Discussion
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryList;