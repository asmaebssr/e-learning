import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Heart, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { motion } from 'framer-motion';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("")
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: null, // 'post', 'comment', or 'reply'
    postId: null,
    commentId: null,
    replyId: null
  });
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts', {
        withCredentials: true,
      });
      setUsername(res.data[0].user.username)
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching posts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const showDeleteConfirmation = (type, postId, commentId = null, replyId = null) => {
    setDeleteModal({
      show: true,
      type,
      postId,
      commentId,
      replyId
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      type: null,
      postId: null,
      commentId: null,
      replyId: null
    });
  };

  const handleDeletePost = async () => {
    try {
      setDeleteInProgress(true);
      await axios.delete(`http://localhost:5000/api/posts/${deleteModal.postId}`, {
        withCredentials: true
      });

      setPosts(posts.filter(post => post._id !== deleteModal.postId));
      setDeleteInProgress(false);
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err.response?.data?.msg || 'Failed to delete post');
      setDeleteInProgress(false);
      closeDeleteModal();
    }
  };

  const handleDeleteComment = async () => {
    try {
      setDeleteInProgress(true);
      await axios.delete(
        `http://localhost:5000/api/posts/comment/${deleteModal.postId}/${deleteModal.commentId}`,
        { withCredentials: true }
      );

      // Refresh the posts to reflect the deleted comment
      fetchPosts();
      setDeleteInProgress(false);
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.msg || 'Failed to delete comment');
      setDeleteInProgress(false);
      closeDeleteModal();
    }
  };

  const handleDeleteReply = async () => {
    try {
      setDeleteInProgress(true);
      await axios.delete(
        `http://localhost:5000/api/posts/comment/${deleteModal.postId}/${deleteModal.commentId}/reply/${deleteModal.replyId}`,
        { withCredentials: true }
      );

      // Refresh the posts to reflect the deleted reply
      fetchPosts();
      setDeleteInProgress(false);
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting reply:', err);
      alert(err.response?.data?.msg || 'Failed to delete reply');
      setDeleteInProgress(false);
      closeDeleteModal();
    }
  };

  const handleConfirmDelete = () => {
    if (deleteModal.type === 'post') {
      handleDeletePost();
    } else if (deleteModal.type === 'comment') {
      handleDeleteComment();
    } else if (deleteModal.type === 'reply') {
      handleDeleteReply();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-8 relative">
        <h1 className="text-3xl font-bold mb-8 text-indigo-800 border-b pb-4 border-indigo-200">Manage Posts</h1>
        
        {posts.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-4">No posts found</p>
              <p className="text-gray-400">Posts that you create will appear here</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {posts.map(post => (
              <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:border-indigo-200">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-indigo-800">{post.title}</h2>
                    <button
                      onClick={() => showDeleteConfirmation('post', post._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                      aria-label="Delete post"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {post.image && (
                    <div className="mb-6 -mx-6">
                      <img
                        src={`http://localhost:5000${post.image}`}
                        alt={post.title}
                        className="w-full h-72 object-cover"
                      />
                    </div>
                  )}
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">{post.text}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <p>Thid post is posted by <span className="text-red-500">{username}</span></p>

                    <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">

                      <Heart className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{post.likes.length}</span>
                    </div>
                    <div className="bg-indigo-50 px-3 py-1 rounded-full">
                      <span className="font-medium">{post.comments.length} comments</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-indigo-100 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-800">Comments</h3>
                    {post.comments.length === 0 ? (
                      <p className="text-gray-500 italic">No comments yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {post.comments.map(comment => (
                          <div key={comment._id} className="bg-indigo-50 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <p className="text-gray-700">{comment.text}</p>
                              <button
                                onClick={() => showDeleteConfirmation('comment', post._id, comment._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 ml-2"
                                aria-label="Delete comment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold mb-2 text-purple-600">Replies</h4>
                              {comment.replies.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No replies yet.</p>
                              ) : (
                                <div className="space-y-2 pl-4 border-l-2 border-indigo-200">
                                  {comment.replies.map(reply => (
                                    <div key={reply._id} className="flex justify-between items-center py-2">
                                      <p className="text-gray-700 text-sm">{reply.text}</p>
                                      <button
                                        onClick={() => showDeleteConfirmation('reply', post._id, comment._id, reply._id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 ml-2"
                                        aria-label="Delete reply"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Delete Confirmation Modal with Animation */}
        {deleteModal.show && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={closeDeleteModal}
            ></motion.div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10 overflow-hidden"
              >
                <div className="flex justify-between items-center border-b border-indigo-100 p-4">
                  <h3 className="text-lg font-semibold text-indigo-800">Confirm Delete</h3>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    onClick={closeDeleteModal}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    {deleteModal.type === 'post' && "Are you sure you want to delete this post? This action cannot be undone."}
                    {deleteModal.type === 'comment' && "Are you sure you want to delete this comment? This action cannot be undone."}
                    {deleteModal.type === 'reply' && "Are you sure you want to delete this reply? This action cannot be undone."}
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
                      onClick={handleConfirmDelete}
                      disabled={deleteInProgress}
                      className={`px-4 py-2 rounded-lg text-white transition-colors ${
                        deleteInProgress
                          ? "bg-indigo-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
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
                        "Delete"
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

export default AllPosts;