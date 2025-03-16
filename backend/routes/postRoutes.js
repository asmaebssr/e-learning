import express from "express";
const router = express.Router();
import Post from "../models/PostModel.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from "../models/userModel.js";

// get posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', ['username'])
      .populate({
        path: 'comments.user',
        select: ['username']
      })
      .sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter - only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Set up multer with our configurations
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create post with file upload
router.post('/create-post', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { title, text } = req.body;
    
    // Create post object
    const postFields = {
      user: req.user.id,
      text,
      likes: [],
      comments: []
    };
    
    // Add optional fields
    if (title) postFields.title = title;
    
    // If image was uploaded, add the path
    if (req.file) {
      // Store relative path in database (make sure this matches your static files serving setup)
      postFields.image = `/uploads/${req.file.filename}`;
    }
    
    // Create and save new post
    const newPost = new Post(postFields);
    const post = await newPost.save();
    
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Error handling for file upload issues
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ msg: 'File too large, maximum size is 5MB' });
    }
    return res.status(400).json({ msg: `Upload error: ${error.message}` });
  }
  next(error);
});

// Toggles like status on a post (adds like if not liked, removes if already liked)
router.put('/like/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked by this user
    if (post.likes.some(like => like.user.toString() === req.user.id)) {
      // Post already liked, so remove the like (toggle functionality)
      post.likes = post.likes.filter(
        like => like.user.toString() !== req.user.id
      );
    } else {
      // Add the user to the likes array
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// create new comment on a post
router.post('/comment/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    const newComment = {
      text: req.body.text,
      name: user.username,
      user: req.user.id
    };
    
    post.comments.unshift(newComment);
    await post.save();
    
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get all comments for a specific post
router.get('/:id/comments', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('comments.user', 'username')
      .populate('comments.replies.user', 'username');
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Toggles like status on a comment (adds like if not liked, removes if already liked)
router.put('/comment/like/:id/:comment_id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Get the comment
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );
    
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    // Check if the comment has already been liked by this user
    if (comment.likes.some(like => like.user.toString() === req.user.id)) {
      // Comment already liked, so remove the like
      comment.likes = comment.likes.filter(
        like => like.user.toString() !== req.user.id
      );
    } else {
      // Add the like
      comment.likes.unshift({ user: req.user.id });
    }
    
    await post.save();
    res.json(comment.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// adds a reply to a specific comment
router.post('/comment/:id/:comment_id/reply', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Find the comment
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );
    
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    const newReply = {
      text: req.body.text,
      name: user.username,
      user: req.user.id
    };
    
    comment.replies.unshift(newReply);
    await post.save();
    
    res.json(comment.replies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// delete a post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Check if user is the post owner
    if (post.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (req.user.isAdmin == false) {
      return res.status(401).json({ msg: 'Ur not an admin' });
    }
    
    await post.deleteOne();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

// update a post (title && text)
router.put('/:id', authenticate, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Check if user is the post owner
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update fields
    post.title = req.body.title || post.title;
    post.text = req.body.text || post.text;
    
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// delete a comment
router.delete('/comment/:id/:comment_id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Pull out comment
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );
    
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    
    // Check if user is comment author
    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Get remove index
    const removeIndex = post.comments
      .map(comment => comment._id.toString())
      .indexOf(req.params.comment_id);
    
    post.comments.splice(removeIndex, 1);
    await post.save();
    
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// delete a reply
router.delete('/comment/:id/:comment_id/reply/:reply_id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Find the comment
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );
    
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    // Find the reply
    const reply = comment.replies.find(
      reply => reply._id.toString() === req.params.reply_id
    );
    
    if (!reply) {
      return res.status(404).json({ msg: 'Reply not found' });
    }
    
    // Check if user is reply author
    if (reply.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Get remove index
    const removeIndex = comment.replies
      .map(reply => reply._id.toString())
      .indexOf(req.params.reply_id);
    
    comment.replies.splice(removeIndex, 1);
    await post.save();
    
    res.json(comment.replies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;