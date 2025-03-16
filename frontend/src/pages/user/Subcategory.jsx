import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Link, useParams } from "react-router-dom";

const Subcategory = () => {
  const { id } = useParams();
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/users/learning-paths/${id}`,
          { withCredentials: true }
        );
        setLearningPath(response.data);
      } catch (err) {
        setError("Failed to load learning path. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLearningPath();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-indigo-500"></div>
            <p className="text-indigo-600 mt-4 font-medium">Loading technologies...</p>
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

  // If no data found
  if (!learningPath) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-indigo-500">
            <p className="text-gray-600 mb-4 font-medium">Learning path not found.</p>
            <Link 
              to="/learning-paths" 
              className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md font-medium"
            >
              Return to Learning Paths
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format subcategory name for display
  const formatSubcategory = (subcategory) => {
    const formattedNames = {
      "frontend": "Frontend Development",
      "backend": "Backend Development",
      "fullstack": "Full Stack Development",
      "ui": "UI Design",
      "ux": "UX Design"
    };
    return formattedNames[subcategory] || subcategory;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <header className="mb-10">
          <div className="flex items-center mb-3">
            <Link 
              to="/learning-paths" 
              className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              Learning Paths
            </Link>
            <span className="mx-2 text-indigo-400">/</span>
            <span className="text-indigo-800 font-medium">{formatSubcategory(learningPath.subcategory)}</span>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">
            {formatSubcategory(learningPath.subcategory)}
          </h1>
          <p className="text-indigo-600 mt-2">{learningPath.description}</p>
        </header>

        <div className="mb-6">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-800">Available Technologies</h2>
            <div className="ml-4 px-4 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
              {learningPath.technologies?.length || 0} {learningPath.technologies?.length === 1 ? "technology" : "technologies"}
            </div>
          </div>
          
          {learningPath.technologies?.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-indigo-500">
              <p className="text-gray-600 mb-4 font-medium">No technologies available yet for this path.</p>
              <p className="text-sm text-indigo-500">Check back later for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {learningPath.technologies?.map((tech) => (
                <div
                  key={tech._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500 h-full flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-center mb-4">
                      {tech.icon && (
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 mr-4 shadow-md">
                          <img src={`http://localhost:5000${tech.icon}`} alt={tech.name} className="w-6 h-6" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-indigo-800">{tech.name}</h3>
                    </div>
                    <p className="text-gray-700 text-sm mb-6 leading-relaxed">{tech.description}</p>
                    <div className="mt-auto">
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                        {tech.resources?.length || 0} {tech.resources?.length === 1 ? "resource" : "resources"}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/technology/${learningPath._id}/${tech._id}`}
                    className="block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
                  >
                    View Resources
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subcategory;