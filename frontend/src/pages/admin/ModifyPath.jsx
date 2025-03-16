import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, PlusCircle, Trash2, Video, Book, Lightbulb } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const ModifyPath = () => {
  const { id } = useParams(); // Get the path ID from the URL
  const navigate = useNavigate();
  const [learningPath, setLearningPath] = useState({
    category: "",
    subcategory: "",
    description: "",
    technologies: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [activeTechIndex, setActiveTechIndex] = useState(null);

  // Fetch the path data
  useEffect(() => {
    const fetchPath = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/learning-paths/${id}`);
        setLearningPath(response.data);
      } catch (err) {
        setError("Failed to fetch learning path");
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [id]);

  // Handle changes in the main fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLearningPath({
      ...learningPath,
      [name]: value,
    });
  };

  // Handle changes in technology fields
  const handleTechChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTechnologies = [...learningPath.technologies];
    updatedTechnologies[index][name] = value;
    setLearningPath({
      ...learningPath,
      technologies: updatedTechnologies,
    });
  };

  // Handle icon file upload for a specific technology
  const handleIconUpload = async (index, e) => {
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

      const updatedTechnologies = [...learningPath.technologies];
      updatedTechnologies[index].icon = `/icons/${response.data.filename}`; // Update the icon path
      setLearningPath({
        ...learningPath,
        technologies: updatedTechnologies,
      });
    } catch (error) {
      console.error("Error uploading icon:", error);
      setError("Failed to upload icon.");
    }
  };

  // Handle changes in resource fields
  const handleResourceChange = (techIndex, resourceIndex, e) => {
    const { name, value } = e.target;
    const updatedTechnologies = [...learningPath.technologies];
    updatedTechnologies[techIndex].resources[resourceIndex][name] = value;
    setLearningPath({
      ...learningPath,
      technologies: updatedTechnologies,
    });
  };

  // Add a new technology
  const addTechnology = () => {
    setLearningPath({
      ...learningPath,
      technologies: [
        ...learningPath.technologies,
        { name: "", description: "", icon: "", resources: [] },
      ],
    });
    setIsAddingTech(false);
  };

  // Add a new resource to a technology
  const addResource = (techIndex) => {
    const updatedTechnologies = [...learningPath.technologies];
    updatedTechnologies[techIndex].resources.push({
      type: "video",
      title: "",
      url: "",
      description: "",
      difficulty: "beginner",
    });
    setLearningPath({
      ...learningPath,
      technologies: updatedTechnologies,
    });
    setIsAddingResource(false);
  };

  // Remove a technology
  const removeTechnology = (index) => {
    const updatedTechnologies = learningPath.technologies.filter((_, i) => i !== index);
    setLearningPath({
      ...learningPath,
      technologies: updatedTechnologies,
    });
  };

  // Remove a resource from a technology
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/learning-paths/${id}`, learningPath);
      navigate("/admin/learning-paths/all"); // Redirect to the AllPaths page after successful update
    } catch (err) {
      setError("Failed to update learning path");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-indigo-700">Loading learning path...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Modify Learning Path</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="bg-white p-6 rounded-lg shadow">
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={learningPath.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter category (e.g., web-development)"
            />
          </div>

          {/* Subcategory */}
          <div className="bg-white p-6 rounded-lg shadow">
            <label className="block text-sm font-medium mb-2">Subcategory</label>
            <input
              type="text"
              name="subcategory"
              value={learningPath.subcategory}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter subcategory (e.g., frontend)"
            />
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={learningPath.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Describe this learning path..."
              rows={4}
            />
          </div>

          {/* Technologies */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Technologies</h2>
            {learningPath.technologies.map((tech, techIndex) => (
              <div key={techIndex} className="border p-4 rounded mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Technology {techIndex + 1}</h3>
                  <button
                    onClick={() => removeTechnology(techIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={tech.name}
                      onChange={(e) => handleTechChange(techIndex, e)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={tech.description}
                      onChange={(e) => handleTechChange(techIndex, e)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon</label>
                    <input
                      type="file"
                      name="icon"
                      onChange={(e) => handleIconUpload(techIndex, e)}
                      className="w-full p-2 border rounded"
                      accept="image/*"
                    />
                    {tech.icon && (
                      <img src={tech.icon} alt="Tech Icon" className="w-6 h-6 mt-2" />
                    )}
                  </div>

                  {/* Resources */}
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Resources</h4>
                    {tech.resources.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="border p-3 rounded mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">Resource {resourceIndex + 1}</h5>
                          <button
                            onClick={() => removeResource(techIndex, resourceIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                              name="type"
                              value={resource.type}
                              onChange={(e) => handleResourceChange(techIndex, resourceIndex, e)}
                              className="w-full p-2 border rounded"
                            >
                              <option value="video">Video</option>
                              <option value="book">Book</option>
                              <option value="mindmap">Mindmap</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              name="title"
                              value={resource.title}
                              onChange={(e) => handleResourceChange(techIndex, resourceIndex, e)}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">URL</label>
                            <input
                              type="url"
                              name="url"
                              value={resource.url}
                              onChange={(e) => handleResourceChange(techIndex, resourceIndex, e)}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              name="description"
                              value={resource.description}
                              onChange={(e) => handleResourceChange(techIndex, resourceIndex, e)}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Difficulty</label>
                            <select
                              name="difficulty"
                              value={resource.difficulty}
                              onChange={(e) => handleResourceChange(techIndex, resourceIndex, e)}
                              className="w-full p-2 border rounded"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addResource(techIndex)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded flex items-center gap-2 mt-2"
                    >
                      <PlusCircle size={16} />
                      Add Resource
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addTechnology}
              className="px-4 py-2 bg-indigo-600 text-white rounded flex items-center gap-2"
            >
              <PlusCircle size={16} />
              Add Technology
            </button>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded flex items-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/learning-paths/all")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyPath;