import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Heart, MessageCircle, Reply, X, Send, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// Comment component to display individual comments and their replies
const Comment = ({ comment, postId, onCommentUpdate }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const replyInputRef = useRef(null);

  const { user, isAuthenticated } = useSelector(state => state.auth);
  const isCommentAuthor = user?.user?._id === comment.user._id;
  const isCommentLiked = comment.likes && comment.likes.some(like => like.user === user?.user?._id);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLikeComment = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like comments');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/posts/comment/like/${postId}/${comment._id}`,
        {},
        { withCredentials: true }
      );
      onCommentUpdate();
    } catch (err) {
      console.error('Error liking comment:', err);
      alert(err.response?.data?.msg || 'Failed to like comment');
    }
  };

  const handleDeleteComment = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/posts/comment/${postId}/${comment._id}`,
        { withCredentials: true }
      );
      onCommentUpdate();
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.msg || 'Failed to delete comment');
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/posts/comment/${postId}/${comment._id}/reply/${replyId}`,
        { withCredentials: true }
      );
      onCommentUpdate();
    } catch (err) {
      console.error('Error deleting reply:', err);
      alert(err.response?.data?.msg || 'Failed to delete reply');
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please log in to reply to comments');
      return;
    }

    if (!replyText.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/posts/comment/${postId}/${comment._id}/reply`,
        { text: replyText },
        { withCredentials: true }
      );
      setReplyText('');
      setIsReplying(false);
      onCommentUpdate();
    } catch (err) {
      console.error('Error adding reply:', err);
      alert(err.response?.data?.msg || 'Failed to add reply');
    }
  };

  useEffect(() => {
    if (isReplying && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [isReplying]);

  return (
    <motion.div
      className="border-l-2 border-indigo-200 pl-4 my-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between">
        <div className="font-semibold text-indigo-800">{comment.name || 'Anonymous'}</div>
        <div className="text-xs text-gray-500">{formatDate(comment.date)}</div>
      </div>

      <div className="my-2 text-gray-700">{comment.text}</div>

      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <button
          onClick={handleLikeComment}
          className={`flex items-center space-x-1 transition-colors ${
            isCommentLiked ? 'text-amber-500' : 'hover:text-amber-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isCommentLiked ? 'fill-current' : ''}`} />
          <span>{comment.likes ? comment.likes.length : 0}</span>
        </button>

        <button
          onClick={() => setIsReplying(!isReplying)}
          className="flex items-center space-x-1 hover:text-indigo-600"
        >
          <Reply className="w-4 h-4" />
          <span>Reply</span>
        </button>

        {comment.replies && comment.replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center space-x-1 hover:text-indigo-600"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{showReplies ? 'Hide replies' : `View ${comment.replies.length} replies`}</span>
          </button>
        )}

        {isCommentAuthor && (
          <button
            onClick={handleDeleteComment}
            className="flex items-center space-x-1 hover:text-red-500 ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        )}
      </div>

      {isReplying && (
        <form onSubmit={handleSubmitReply} className="mt-2 flex items-center">
          <input
            ref={replyInputRef}
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 border border-indigo-200 rounded-l-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-2 rounded-r-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsReplying(false)}
            className="bg-gray-200 text-gray-700 p-2 rounded-md ml-2 hover:bg-gray-300 transition-all duration-300"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 mt-2">
          {comment.replies.map((reply) => {
            const isReplyAuthor = user?.user?._id === reply.user._id;

            return (
              <motion.div
                key={reply._id}
                className="border-l-2 border-indigo-100 pl-3 my-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between">
                  <div className="font-semibold text-sm text-indigo-700">{reply.name || 'Anonymous'}</div>
                  <div className="text-xs text-gray-500">{formatDate(reply.date)}</div>
                </div>
                <div className="text-sm my-1 text-gray-700">{reply.text}</div>

                {isReplyAuthor && (
                  <button
                    onClick={() => handleDeleteReply(reply._id)}
                    className="flex items-center space-x-1 text-xs hover:text-red-500 mt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

// Comments section component
const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useSelector(state => state.auth);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`, {
        withCredentials: true
      });
      setComments(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please log in to comment');
      return;
    }

    if (!newComment.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/posts/comment/${postId}`,
        { text: newComment },
        { withCredentials: true }
      );
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.response?.data?.msg || 'Failed to add comment');
    }
  };

  return (
    <motion.div
      className="mt-6 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold text-indigo-800 mb-4">Comments ({comments.length})</h3>

      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isAuthenticated ? "Add a comment..." : "Please log in to comment"}
          className="w-full border border-indigo-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="3"
          disabled={!isAuthenticated}
        />
        <button
          type="submit"
          className={`mt-2 px-4 py-2 rounded-md transition-all duration-300 ${
            isAuthenticated
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isAuthenticated || !newComment.trim()}
        >
          Post Comment
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <Comment
              key={comment._id}
              comment={comment}
              postId={postId}
              onCommentUpdate={fetchComments}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export { CommentsSection, Comment };