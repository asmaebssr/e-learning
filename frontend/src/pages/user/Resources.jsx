import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import { Search, BookOpen, Video, FileText, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import ResourcesChatbot from "../../components/ResourcesChatbot";

const Resources = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [resourceTypeFilter, setResourceTypeFilter] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);

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
        setError("Failed to load resources. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLearningPaths();
  }, []);

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

  // Format category name for display
  const formatCategory = (category) => {
    const formattedNames = {
      "web-development": "Web Development",
      "ui-ux-design": "UI/UX Design",
      "data-science": "Data Science"
    };
    return formattedNames[category] || category;
  };

  // Resource icon mapper
  const getResourceIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-indigo-500" />;
      case "book":
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case "mindmap":
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  // Function to reset all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setSubcategoryFilter("");
    setDifficultyFilter("");
    setResourceTypeFilter("");
  };

  // Filter function for learning paths
  const filteredLearningPaths = learningPaths.filter(path => {
    // Category filter
    if (categoryFilter && path.category !== categoryFilter) return false;
    
    // Subcategory filter
    if (subcategoryFilter && path.subcategory !== subcategoryFilter) return false;
    
    // Check if there are any technologies with resources that match the filters
    if (searchTerm || difficultyFilter || resourceTypeFilter) {
      return path.technologies.some(tech => {
        // Check if technology matches search term
        const techMatchesSearch = !searchTerm || 
          tech.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          tech.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Check if any resources match the filters
        const hasMatchingResources = tech.resources.some(resource => {
          // Check resource difficulty filter
          if (difficultyFilter && resource.difficulty !== difficultyFilter) return false;
          
          // Check resource type filter
          if (resourceTypeFilter && resource.type !== resourceTypeFilter) return false;
          
          // Check if resource matches search term
          if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
              (!resource.description || !resource.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
            return false;
          }
          
          return true;
        });
        
        return techMatchesSearch || hasMatchingResources;
      });
    }
    
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-indigo-700">Loading resources...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 p-6 rounded-lg border border-red-200 text-center max-w-lg shadow-md"
          >
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors shadow-sm"
            >
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700">
              Learning Resources
            </h1>
            <p className="text-gray-600 mt-2">
              Browse, search and filter all available learning resources
            </p>
          </header>
          
          {/* Search and Filter section */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              {/* Search input */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search technologies, resources..."
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter toggle button */}
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Filter className="h-4 w-4" />
                {filtersVisible ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
            
            {/* Filter options - conditionally shown */}
            {filtersVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="web-development">Web Development</option>
                      <option value="ui-ux-design">UI/UX Design</option>
                      <option value="data-science">Data Science</option>
                    </select>
                  </div>
                  
                  {/* Subcategory filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                    <select
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={subcategoryFilter}
                      onChange={(e) => setSubcategoryFilter(e.target.value)}
                    >
                      <option value="">All Subcategories</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="fullstack">Fullstack</option>
                      <option value="ui">UI</option>
                      <option value="ux">UX</option>
                    </select>
                  </div>
                  
                  {/* Difficulty filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                    >
                      <option value="">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  {/* Resource type filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
                    <select
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={resourceTypeFilter}
                      onChange={(e) => setResourceTypeFilter(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="video">Videos</option>
                      <option value="book">Books</option>
                      <option value="mindmap">Mindmaps</option>
                    </select>
                  </div>
                </div>
                
                {/* Clear filters button */}
                {(searchTerm || categoryFilter || subcategoryFilter || difficultyFilter || resourceTypeFilter) && (
                  <div className="mt-4 flex justify-end">
                    <button 
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"
                      onClick={clearAllFilters}
                    >
                      <X className="h-4 w-4" />
                      Clear all filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
          
          {/* Results count */}
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-indigo-600 font-medium">
              Found {filteredLearningPaths.length} learning paths with matching resources
            </p>
          </motion.div>
          
          {/* Learning paths and resources */}
          {filteredLearningPaths.length > 0 ? (
            <div className="space-y-8">
              {filteredLearningPaths.map((path, index) => {
                // Filter technologies to only those that match the search/filters
                const matchingTechnologies = path.technologies.filter(tech => {
                  // Check if technology matches search term
                  const techMatchesSearch = !searchTerm || 
                    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    tech.description.toLowerCase().includes(searchTerm.toLowerCase());
                  
                  // Check if any resources match the filters
                  const hasMatchingResources = tech.resources.some(resource => {
                    if (difficultyFilter && resource.difficulty !== difficultyFilter) return false;
                    if (resourceTypeFilter && resource.type !== resourceTypeFilter) return false;
                    if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
                        (!resource.description || !resource.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
                      return false;
                    }
                    return true;
                  });
                  
                  return techMatchesSearch || hasMatchingResources;
                });
                
                // Skip this learning path if no technologies match
                if (matchingTechnologies.length === 0) return null;
                
                return (
                  <motion.div 
                    key={path._id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (index * 0.1) }}
                  >
                    {/* Learning path header */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            {formatCategory(path.category)} - {formatSubcategory(path.subcategory)}
                          </h2>
                          <p className="text-gray-600 mt-1">{path.description}</p>
                        </div>
                        <Link 
                          to={`/learning-paths/${path._id}`}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors text-sm shadow-sm"
                        >
                          View Path
                        </Link>
                      </div>
                    </div>
                    
                    {/* Technologies and Resources */}
                    <div className="divide-y divide-gray-100">
                      {matchingTechnologies.map((tech, techIndex) => {
                        // Filter resources based on the current filters
                        const filteredResources = tech.resources.filter(resource => {
                          if (difficultyFilter && resource.difficulty !== difficultyFilter) return false;
                          if (resourceTypeFilter && resource.type !== resourceTypeFilter) return false;
                          if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
                              (!resource.description || !resource.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
                            return false;
                          }
                          return true;
                        });
                        
                        // Skip this technology if no resources match and the tech name doesn't match search
                        if (filteredResources.length === 0 && searchTerm && 
                            !tech.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
                            !tech.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return null;
                        }
                        
                        return (
                          <motion.div 
                            key={tech._id} 
                            className="p-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 + (techIndex * 0.1) }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                {tech.icon && (
                                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 mr-3 shadow-sm">
                                    <img src={`http://localhost:5000${tech.icon}`} alt={tech.name} className="w-5 h-5" />
                                  </div>
                                )}
                                <h3 className="text-lg font-medium text-gray-800">{tech.name}</h3>
                              </div>
                              <Link
                                to={`/technology/${path._id}/${tech._id}`}
                                className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors shadow-sm"
                              >
                                View All Resources
                              </Link>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4">{tech.description}</p>
                            
                            {/* Resources */}
                            {filteredResources.length > 0 ? (
                              <div className="space-y-3 mt-4 pl-4 border-l-2 border-indigo-200">
                                {filteredResources.map((resource, idx) => (
                                  <motion.div 
                                    key={idx} 
                                    className="bg-gradient-to-r from-gray-50 to-indigo-50 p-3 rounded-lg hover:shadow-md transition-shadow"
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      {getResourceIcon(resource.type)}
                                      <a 
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                      >
                                        {resource.title}
                                      </a>
                                      <span className={`text-xs px-2 py-1 rounded-full text-white ${
                                        resource.difficulty === "beginner" ? "bg-green-500" :
                                        resource.difficulty === "intermediate" ? "bg-indigo-500" : "bg-purple-600"
                                      }`}>
                                        {resource.difficulty}
                                      </span>
                                    </div>
                                    {resource.description && (
                                      <p className="text-sm text-gray-600 ml-6">{resource.description}</p>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic mt-4">
                                No resources match your current filters
                              </p>
                            )}
                          </motion.div>
                        );
                      }).filter(Boolean)}
                    </div>
                  </motion.div>
                );
              }).filter(Boolean)}
            </div>
          ) : (
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-600 mb-4">No learning resources found matching your filters</p>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-sm"
                onClick={clearAllFilters}
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Integrated Chatbot - Fixed position in bottom right */}
      <ResourcesChatbot learningPaths={learningPaths} />
    </div>
  );
};

export default Resources;