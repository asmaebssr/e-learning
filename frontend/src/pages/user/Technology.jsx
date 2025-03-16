import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Link, useParams } from "react-router-dom";

const Technology = () => {
  const { pathId, techId } = useParams();
  const [technology, setTechnology] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/users/learning-path/${pathId}/technology/${techId}`,
          { withCredentials: true }
        );
        setLearningPath(response.data.learningPath);
        setTechnology(response.data.technology);
      } catch (err) {
        setError("Failed to load resources. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pathId, techId]);

  // Filter resources by type
  const filteredResources = technology?.resources?.filter(resource => 
    activeFilter === "all" || resource.type === activeFilter
  ) || [];

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

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-indigo-500"></div>
            <p className="text-indigo-600 mt-4 font-medium">Loading resources...</p>
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
  if (!technology || !learningPath) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-indigo-500">
            <p className="text-gray-600 mb-4 font-medium">Technology not found.</p>
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
            <Link 
              to={`/subcategory/${pathId}`} 
              className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              {formatSubcategory(learningPath.subcategory)}
            </Link>
            <span className="mx-2 text-indigo-400">/</span>
            <span className="text-indigo-800 font-medium">{technology.name}</span>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">
            {technology.name}
          </h1>
          <p className="text-indigo-600 mt-2">{technology.description}</p>
        </header>

        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-indigo-800">Learning Resources</h2>
              <div className="ml-4 px-4 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
                {technology.resources?.length || 0} {technology.resources?.length === 1 ? "resource" : "resources"}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-white text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("video")}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
                  activeFilter === "video"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-white text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setActiveFilter("book")}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
                  activeFilter === "book"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-white text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                Books
              </button>
              <button
                onClick={() => setActiveFilter("mindmap")}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
                  activeFilter === "mindmap"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-white text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                Mindmaps
              </button>
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-indigo-500">
              <p className="text-gray-600 mb-4 font-medium">
                {activeFilter === "all" 
                  ? "No resources available yet for this technology." 
                  : `No ${activeFilter} resources available yet.`}
              </p>
              <p className="text-sm text-indigo-500">Check back later for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500 h-full flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-center mb-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        resource.type === "video" ? "bg-red-100 text-red-700" :
                        resource.type === "book" ? "bg-green-100 text-green-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {resource.type}
                      </span>
                      {resource.difficulty && (
                        <span className="ml-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">
                          {resource.difficulty}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-indigo-800 mb-3">{resource.title}</h3>
                    {resource.description && (
                      <p className="text-gray-700 text-sm mb-6 leading-relaxed">{resource.description}</p>
                    )}
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
                  >
                    Open Resource
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Technology;