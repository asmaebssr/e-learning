import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { Trash2, ChevronDown, ChevronRight, AlertCircle, UserX, X, Search, UserPlus, Filter, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageParticipants = () => {
  const { subcategory } = useParams();
  const [communities, setCommunities] = useState([]);
  const [expandedCommunity, setExpandedCommunity] = useState(null);
  const [communityMembers, setCommunityMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removingCommunity, setRemovingCommunity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all communities
  useEffect(() => {
    const fetchAllCommunities = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/communities/subcategories`,
          { withCredentials: true }
        );
        setCommunities(response.data || []);
      } catch (err) {
        console.error('Error fetching communities:', err.response?.data || err.message);
        setError(`Failed to fetch communities: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCommunities();
  }, []);

  // Fetch members for a specific community
  const fetchCommunityMembers = async (communitySlug) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/communities/${communitySlug}/members`,
        { withCredentials: true }
      );
      
      // Update the communityMembers state with the new data
      setCommunityMembers(prev => ({
        ...prev,
        [communitySlug]: response.data.members || []
      }));
    } catch (err) {
      console.error(`Error fetching members for ${communitySlug}:`, err.response?.data || err.message);
      setError(`Failed to fetch members: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle community expansion and fetch members if needed
  const toggleCommunity = async (communitySlug) => {
    if (expandedCommunity === communitySlug) {
      setExpandedCommunity(null);
    } else {
      setExpandedCommunity(communitySlug);
      
      // Only fetch if we don't already have the members
      if (!communityMembers[communitySlug]) {
        await fetchCommunityMembers(communitySlug);
      }
    }
  };

  // Show confirmation modal before removing a member
  const confirmRemoveMember = (communitySlug, member) => {
    setMemberToRemove(member);
    setRemovingCommunity(communitySlug);
    setShowConfirmModal(true);
  };

  // Cancel member removal
  const cancelRemoveMember = () => {
    setShowConfirmModal(false);
    setMemberToRemove(null);
    setRemovingCommunity(null);
  };

  // Remove a member from a community
  const handleRemoveMember = async () => {
    if (!memberToRemove || !removingCommunity) return;
    
    try {
      setLoading(true);
      
      // Use the leave endpoint for removing a member
      await axios.post(
        `http://localhost:5000/api/communities/remove-member/${removingCommunity}`,
        { userId: memberToRemove._id }, // Send the ID of the user to remove
        { withCredentials: true }
      );

      // Update the members list in the UI
      setCommunityMembers(prev => ({
        ...prev,
        [removingCommunity]: prev[removingCommunity].filter((member) => member._id !== memberToRemove._id)
      }));
      
      // Close the modal
      setShowConfirmModal(false);
      setMemberToRemove(null);
      setRemovingCommunity(null);
    } catch (err) {
      console.error('Error removing member:', err.response?.data || err.message);
      setError(`Failed to remove member: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on search term
  const filterMembers = (members) => {
    if (!searchTerm) return members;
    return members.filter(member => 
      member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading && communities.length === 0) {
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

  if (error && communities.length === 0) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <AdminSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl border border-red-200 text-center max-w-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="text-red-500 w-8 h-8 mr-2" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 mb-2">
            Manage Community Participants
          </h1>
          <p className="text-gray-600">Oversee members across all communities</p>
        </div>

        {/* Search and filter section */}
        {/* <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search members..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md">
              <UserPlus size={16} />
              Add Members
            </button>
          </div>
        </div> */}

        <div className="space-y-4">
          {communities.length > 0 ? (
            communities.map((community) => (
              <motion.div 
                key={community._id || community.slug} 
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCommunity(community.slug || community.name)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="flex items-center">
                    <Shield size={20} className="mr-3 text-white opacity-80" />
                    <div>
                      <h2 className="text-lg font-medium">{community.name}</h2>
                      {communityMembers[community.slug || community.name] && (
                        <p className="text-xs text-indigo-100 mt-1">
                          {communityMembers[community.slug || community.name].length} members
                        </p>
                      )}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedCommunity === (community.slug || community.name) ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={22} />
                  </motion.div>
                </motion.div>
                
                <AnimatePresence>
                  {expandedCommunity === (community.slug || community.name) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {loading && !communityMembers[community.slug || community.name] ? (
                        <div className="p-8 text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 mx-auto"></div>
                          <p className="text-indigo-600 mt-2 text-sm">Loading members...</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-indigo-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-indigo-800 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-indigo-800 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {communityMembers[community.slug || community.name]?.length > 0 ? (
                                filterMembers(communityMembers[community.slug || community.name]).map((member) => (
                                  <motion.tr 
                                    key={member._id} 
                                    className="hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <td className="px-6 py-4">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white font-medium">
                                          {member.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{member.username}</div>
                                          <div className="text-xs text-gray-500">Member since {new Date().toLocaleDateString()}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                        {member._id.substring(0, 8)}...
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                        Active
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end space-x-2">
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => confirmRemoveMember(community.slug || community.name, member)}
                                          className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-lg p-2 transition-colors"
                                          title="Remove member"
                                        >
                                          <Trash2 size={16} />
                                        </motion.button>
                                      </div>
                                    </td>
                                  </motion.tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="p-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                      <UserX size={32} className="text-gray-400 mb-2" />
                                      <p>No members found in this community.</p>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                                              
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="flex flex-col items-center">
                <Shield size={40} className="text-gray-400 mb-4" />
                <p className="text-gray-600">No communities found.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Create a new community to start managing participants.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <>
              {/* Backdrop with blur effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                onClick={cancelRemoveMember}
              ></motion.div>

              {/* Modal */}
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border border-indigo-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                        <UserX className="text-white" size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Confirm Removal</h3>
                    </div>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      onClick={cancelRemoveMember}
                      className="text-white hover:text-indigo-100 bg-white/10 p-1 rounded-full hover:bg-white/20"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-700 mb-6 pl-4 border-l-4 border-indigo-300 py-2">
                      Are you sure you want to remove{" "}
                      <span className="font-semibold text-indigo-700">{memberToRemove?.username}</span> from{" "}
                      <span className="font-semibold text-purple-700">{removingCommunity}</span>?
                    </p>

                    <div className="flex justify-end space-x-3 mt-8">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={cancelRemoveMember}
                        className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRemoveMember}
                        disabled={loading}
                        className={`px-5 py-2 rounded-lg text-white transition-colors shadow-md font-medium ${
                          loading
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Removing...
                          </div>
                        ) : (
                          "Remove Member"
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageParticipants;