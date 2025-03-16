import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import { Grid, List } from 'lucide-react';

// Helper function to group learning paths by category
const groupByCategory = (learningPaths) => {
  return learningPaths.reduce((acc, path) => {
    if (!acc[path.category]) {
      acc[path.category] = [];
    }
    acc[path.category].push(path);
    return acc;
  }, {});
};

const LearningPaths = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Fetch learning paths from the backend
  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/users/learning-paths",
          { withCredentials: true }
        );
        setLearningPaths(response.data);
      } catch (err) {
        setError("Failed to load learning paths. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLearningPaths();
  }, []);

  // Group learning paths by category
  const groupedPaths = groupByCategory(learningPaths);

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const formatCategoryName = (category) => {
    return category === "web-development" ? "Web Development" : 
           category === "ui-ux-design" ? "UI/UX Design" : 
           category === "data-science" ? "Data Science" : category;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-indigo-500"></div>
            <p className="text-indigo-600 mt-4 font-medium">Loading learning paths...</p>
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

  // Main content
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <header>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">
              Learning Paths
            </h1>
            <p className="text-indigo-600 mt-2">Curated resources to help you master new skills</p>
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

        {Object.keys(groupedPaths).length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-indigo-500">
            <p className="text-gray-600 mb-4 font-medium">No learning paths available yet.</p>
            <p className="text-sm text-indigo-500">Check back later for new content!</p>
          </div>
        ) : (
          Object.entries(groupedPaths).map(([category, paths]) => (
            <div key={category} className="mb-14">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-800">
                  {formatCategoryName(category)}
                </h2>
                <div className="ml-4 px-4 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
                  {paths.length} {paths.length === 1 ? "path" : "paths"}
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paths.map((path) => (
                    <div
                      key={path._id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500 h-full flex flex-col"
                    >
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-indigo-800">{path.subcategory}</h3>
                          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                            {path.technologies?.length || 0} {path.technologies?.length === 1 ? "technology" : "technologies"}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-6 leading-relaxed">{path.description}</p>
                      </div>

                      <Link
                        to={`/subcategory/${path._id}`}
                        className="block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
                      >
                        Explore Technologies
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {paths.map((path) => (
                    <div
                      key={path._id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500 max-w-2xl mx-auto"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold text-indigo-800">{path.subcategory}</h3>
                          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                            {path.technologies?.length || 0} {path.technologies?.length === 1 ? "technology" : "technologies"}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-6 leading-relaxed">{path.description}</p>

                        <div className="flex justify-end">
                          <Link
                            to={`/subcategory/${path._id}`}
                            className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md font-medium"
                          >
                            Explore Technologies
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LearningPaths;