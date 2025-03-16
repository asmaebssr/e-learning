import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Trash2, Edit, Grid, List } from 'lucide-react';
import { CommentsSection } from "../../components/CommentSystem";
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', text: '' });
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  const { user, isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts', {
        withCredentials: true,
      });
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

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      alert('Please log in to like posts');
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/posts/like/${postId}`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts(posts.map(post =>
        post._id === postId
          ? { ...post, likes: res.data }
          : post
      ));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Something went wrong');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        withCredentials: true
      });

      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err.response?.data?.msg || 'Failed to delete post');
    }
  };

  const startEditingPost = (post) => {
    setEditingPost(post._id);
    setEditForm({
      title: post.title,
      text: post.text
    });
  };

  const cancelEditing = () => {
    setEditingPost(null);
    setEditForm({ title: '', text: '' });
  };

  const handleEditFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const submitEditPost = async (postId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${postId}`, editForm, {
        withCredentials: true
      });

      // Fetch all posts to ensure we have complete data
      fetchPosts();
      setEditingPost(null);
    } catch (err) {
      console.error('Error updating post:', err);
      alert(err.response?.data?.msg || 'Failed to update post');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        {error}
      </div>
    );
  }

  const renderPost = (post) => {
    const isLiked = post.likes.some(like => like.user === user?.user?._id);
    const isPostAuthor = user?.user?._id === post.user?._id;
    const isEditing = editingPost === post._id;

    return (
      <motion.div
        key={post._id}
        className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500 ${
          viewMode === 'grid' ? 'h-full flex flex-col' : 'max-w-2xl mx-auto mb-8'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {post.image && !isEditing && (
          <div className="w-full">
            <img
              src={`http://localhost:5000${post.image}`}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        <div className="p-6 flex-grow">
          {isEditing ? (
            <div className="mb-4">
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditFormChange}
                placeholder="Post title"
                className="w-full border border-indigo-200 rounded-md p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                name="text"
                value={editForm.text}
                onChange={handleEditFormChange}
                placeholder="Post content"
                rows="4"
                className="w-full border border-indigo-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex mt-3 space-x-2">
                <button
                  onClick={() => submitEditPost(post._id)}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">{post.title}</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">{post.text}</p>
            </>
          )}

          {!isEditing && (
            <div className="flex items-center justify-between text-gray-500 text-sm border-t border-gray-100 pt-4 mt-auto">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-indigo-700">By: {post.user?.username}</span>
                <span>{formatDate(post.date)}</span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className={`flex items-center space-x-1 transition-colors ${
                    isLiked ? 'text-indigo-600' : 'hover:text-indigo-600'
                  }`}
                  onClick={() => handleLike(post._id)}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes.length}</span>
                </button>

                <button
                  className={`flex items-center space-x-1 ${
                    expandedPost === post._id ? 'text-indigo-600' : 'hover:text-indigo-600'
                  }`}
                  onClick={() => toggleComments(post._id)}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </button>

                {isPostAuthor && (
                  <>
                    <button
                      onClick={() => startEditingPost(post)}
                      className="flex items-center space-x-1 hover:text-indigo-600"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="flex items-center space-x-1 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {expandedPost === post._id && !isEditing && (
          <div className="w-full">
            <CommentsSection postId={post._id} />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <Link
            to="create-post"
            className={`font-bold py-2 px-6 rounded-lg transition-colors duration-200 ${
              isAuthenticated
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create a post
          </Link>
          
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

        <h1 className="text-4xl font-bold text-center mb-14 mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">
          All Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-600 bg-white p-8 rounded-xl shadow-md">No posts found. Be the first to create one!</p>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <div key={post._id}>{renderPost(post)}</div>
              ))}
            </div>
          ) : (
            <div>
              {posts.map(post => renderPost(post))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Blog;