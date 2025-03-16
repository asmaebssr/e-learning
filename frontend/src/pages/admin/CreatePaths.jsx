import React, { useState } from "react";
import axios from "axios";
import { PlusCircle, Trash2, Save } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

const CreatePaths = () => {
  const [learningPath, setLearningPath] = useState({
    category: "",
    subcategory: "",
    description: "",
    technologies: [],
  });

  const [currentTech, setCurrentTech] = useState({
    name: "",
    description: "",
    icon: "", // This will store the file path or URL
    resources: [],
  });

  const [currentResource, setCurrentResource] = useState({
    type: "video",
    title: "",
    url: "",
    description: "",
    difficulty: "beginner",
  });

  const [isAddingTech, setIsAddingTech] = useState(false);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [activeTechIndex, setActiveTechIndex] = useState(null);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle changes in the learning path fields
  const handlePathChange = (e) => {
    setLearningPath({
      ...learningPath,
      [e.target.name]: e.target.value,
    });
  };

  // Handle changes in the technology fields
  const handleTechChange = (e) => {
    setCurrentTech({
      ...currentTech,
      [e.target.name]: e.target.value,
    });
  };

  // Handle changes in the resource fields
  const handleResourceChange = (e) => {
    setCurrentResource({
      ...currentResource,
      [e.target.name]: e.target.value,
    });
  };

  // Handle icon file upload
  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("icon", file);

    try {
      const response = await axios.post("http://localhost:5000/api/upload-icon", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the currentTech state with the returned file path
      setCurrentTech({
        ...currentTech,
        icon: `/icons/${response.data.filename}`, // Use the path returned by the backend
      });
    } catch (error) {
      console.error("Error uploading icon:", error);
      setFormError("Failed to upload icon.");
    }
  };

  // Add a new technology to the learning path
  const addTechnology = () => {
    if (!currentTech.name || !currentTech.description) {
      setFormError("Technology name and description are required");
      return;
    }

    setLearningPath({
      ...learningPath,
      technologies: [...learningPath.technologies, { ...currentTech, resources: [] }],
    });

    // Reset the currentTech state
    setCurrentTech({
      name: "",
      description: "",
      icon: "",
      resources: [],
    });

    setIsAddingTech(false);
    setFormError("");
  };

  // Add a new resource to the active technology
  const addResource = () => {
    if (!currentResource.title || !currentResource.url) {
      setFormError("Resource title and URL are required");
      return;
    }

    const updatedTechnologies = [...learningPath.technologies];
    updatedTechnologies[activeTechIndex].resources.push({ ...currentResource });

    setLearningPath({
      ...learningPath,
      technologies: updatedTechnologies,
    });

    // Reset the currentResource state
    setCurrentResource({
      type: "video",
      title: "",
      url: "",
      description: "",
      difficulty: "beginner",
    });

    setIsAddingResource(false);
    setFormError("");
  };

  // Remove a technology from the learning path
  const removeTechnology = (index) => {
    const updatedTechnologies = learningPath.technologies.filter((_, i) => i !== index);
    setLearningPath({
      ...learningPath,
      technologies: updatedTechnologies,
    });
    if (activeTechIndex === index) {
      setActiveTechIndex(null);
    }
  };

  // Remove a resource from the active technology
  const removeResource = (techIndex, resourceIndex) => {
    const updatedTechnologies = [...learningPath.technologies];
    updatedTechnologies[techIndex].resources = updatedTechnologies[techIndex].resources.filter(
      (_, i) => i !== resourceIndex
    );

    setLearningPath({
      ...learningPath,
      technologies: updatedTechnologies,
    });
  };

  // Save the learning path to the backend
  const saveLearningPath = async () => {
    if (!learningPath.description || learningPath.technologies.length === 0) {
      setFormError("Path description and at least one technology are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/learning-paths", learningPath);
      if (response.status === 201) {
        setSuccessMessage("Learning path created successfully!");
        setLearningPath({
          category: "",
          subcategory: "",
          description: "",
          technologies: [],
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to create learning path");
    }
  };

  // Render the icon for a technology
  const getTechIcon = (iconPath) => {
    return <img src={iconPath} alt="Tech Icon" className="w-6 h-6" />;
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Learning Path</h1>

        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Path Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Path Details</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={learningPath.category}
                onChange={handlePathChange}
                className="w-full p-2 border rounded"
                placeholder="Enter category (e.g., web-development)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subcategory</label>
              <input
                type="text"
                name="subcategory"
                value={learningPath.subcategory}
                onChange={handlePathChange}
                className="w-full p-2 border rounded"
                placeholder="Enter subcategory (e.g., frontend)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={learningPath.description}
                onChange={handlePathChange}
                className="w-full p-2 border rounded h-32"
                placeholder="Describe this learning path..."
              />
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Technologies</h2>
              {!isAddingTech && (
                <button
                  onClick={() => setIsAddingTech(true)}
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <PlusCircle size={16} className="mr-1" /> Add Technology
                </button>
              )}
            </div>

            {isAddingTech ? (
              <div className="border p-4 rounded mb-4">
                <h3 className="font-medium mb-2">New Technology</h3>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentTech.name}
                    onChange={handleTechChange}
                    className="w-full p-2 border rounded"
                    placeholder="React, Node.js, etc."
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={currentTech.description}
                    onChange={handleTechChange}
                    className="w-full p-2 border rounded"
                    placeholder="Describe this technology..."
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <input
                    type="file"
                    name="icon"
                    onChange={handleIconUpload}
                    className="w-full p-2 border rounded"
                    accept="image/*"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setIsAddingTech(false)}
                    className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTechnology}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {learningPath.technologies.length === 0 ? (
                  <p className="text-gray-500 italic">No technologies added yet.</p>
                ) : (
                  learningPath.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className={`border p-3 rounded mb-2 cursor-pointer ${
                        activeTechIndex === index ? "border-indigo-500 bg-indigo-50" : ""
                      }`}
                      onClick={() => setActiveTechIndex(activeTechIndex === index ? null : index)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getTechIcon(tech.icon)}
                          <h3 className="font-medium">{tech.name}</h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTechnology(index);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{tech.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Resources for Active Technology */}
        {activeTechIndex !== null && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Resources for {learningPath?.technologies[activeTechIndex].name}
              </h2>
              {!isAddingResource && (
                <button
                  onClick={() => setIsAddingResource(true)}
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <PlusCircle size={16} className="mr-1" /> Add Resource
                </button>
              )}
            </div>

            {isAddingResource ? (
              <div className="border p-4 rounded mb-4">
                <h3 className="font-medium mb-2">New Resource</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      name="type"
                      value={currentResource.type}
                      onChange={handleResourceChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="video">Video</option>
                      <option value="book">Book</option>
                      <option value="mindmap">Mindmap</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                    <select
                      name="difficulty"
                      value={currentResource.difficulty}
                      onChange={handleResourceChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={currentResource.title}
                    onChange={handleResourceChange}
                    className="w-full p-2 border rounded"
                    placeholder="Resource title"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    type="url"
                    name="url"
                    value={currentResource.url}
                    onChange={handleResourceChange}
                    className="w-full p-2 border rounded"
                    placeholder="https://example.com/resource"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={currentResource.description}
                    onChange={handleResourceChange}
                    className="w-full p-2 border rounded"
                    placeholder="Describe this resource..."
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setIsAddingResource(false)}
                    className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addResource}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {learningPath.technologies[activeTechIndex].resources.map((resource, index) => (
                  <div key={index} className="border p-3 rounded flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getResourceIcon(resource.type)}
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeResource(activeTechIndex, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save Learning Path Button */}
        <div className="mt-6">
          <button
            onClick={saveLearningPath}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
          >
            <Save size={16} /> Save Learning Path
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePaths;