import express from 'express';
import Subcategory from '../models/CommunityModel.js';
import Message from '../models/MessageModel.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { connectedUsers } from '../server.js';
import upload from '../middlewares/uploadConfig.js';

const router = express.Router();

// Get all subcategories with stats
router.get('/subcategories', async (req, res) => {
  try {
    const subcategories = await Subcategory.find({}).lean();
    
    // Enhance with additional data
    const enhancedSubcategories = await Promise.all(subcategories.map(async (subcategory) => {
      // Get message count
      const messageCount = await Message.countDocuments({ subcategory: subcategory.slug });

      return {
        ...subcategory,
        totalMessages: messageCount,
        membersCount: subcategory.members ? subcategory.members.length : 0,
        onlineUsers: connectedUsers.has(subcategory.slug) 
          ? connectedUsers.get(subcategory.slug).size 
          : 0
      };

    }));
    
    res.json(enhancedSubcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Create new community
router.post('/subcategory', upload.single('image'), async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : '';

    // Validate required fields
    if (!name || !slug || !description) {
      return res.status(400).json({ message: "Name, slug, and description are required" });
    }

    // Check if the slug is unique
    const existingCommunity = await Subcategory.findOne({ slug });
    if (existingCommunity) {
      return res.status(400).json({ message: "Slug must be unique" });
    }

    // Create the community
    const newCommunity = new Subcategory({
      name,
      slug,
      description,
      imageUrl,
    });

    // Save to the database
    await newCommunity.save();

    res.status(201).json({ message: "Community created successfully", community: newCommunity });
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get messages for a specific subcategory
router.get('/:subcategory/messages', authenticate, async (req, res) => {
  try {
    const { subcategory } = req.params;
    const messages = await Message.find({ subcategory })
      .sort({ createdAt: 1 })
      .limit(50);
    
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Delete a community by ID
router.delete('/subcategory/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the community
    const deletedCommunity = await Subcategory.findByIdAndDelete(id);

    if (!deletedCommunity) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error("Error deleting community:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// join a community
router.post('/join/:subcategory', authenticate, async (req, res) => {
  try {
    const { subcategory } = req.params;
    const userId = req.user._id;

    const community = await Subcategory.findOne({ slug: subcategory });
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if already a member
    if (community.members.includes(userId)) {
      return res.status(400).json({ message: 'Already a member of this community' });
    }

    // Add user to community members
    community.members.push(userId);
    await community.save();

    return res.status(200).json({ 
      message: 'Successfully joined the community',
      isMember: true
    });
  } catch (error) {
    console.error('Error joining community:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Leave a community
router.post('/leave/:subcategory', authenticate, async (req, res) => {
  try {
    const { subcategory } = req.params;
    const userId = req.user._id;

    const community = await Subcategory.findOne({ slug: subcategory });
    console.log(community.members)
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if user is a member
    if (!community.members.includes(userId)) {
      return res.status(400).json({ message: 'Not a member of this community' });
    }

    // Remove user from community members
    community.members = community.members.filter(
      member => member.toString() !== userId.toString()
    );
    await community.save();

    return res.status(200).json({ 
      message: 'Successfully left the community',
      isMember: false
    });
  } catch (error) {
    console.error('Error leaving community:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get community members
router.get('/:subcategory/members', async (req, res) => {
  try {
    const { subcategory } = req.params;
    
    const community = await Subcategory.findOne({ slug: subcategory })
      .populate('members', 'username profileImage');
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    return res.status(200).json({ members: community.members });
  } catch (error) {
    console.error('Error fetching community members:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Check membership status
router.get('/:subcategory/membership', authenticate, async (req, res) => {
  try {
    const { subcategory } = req.params;
    const userId = req.user._id;

    const community = await Subcategory.findOne({ slug: subcategory });
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const isMember = community.members.some(
      member => member.toString() === userId.toString()
    );

    return res.status(200).json({ isMember });
  } catch (error) {
    console.error('Error checking membership:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// this for admin to remove a user from a community
router.post('/remove-member/:subcategory', authenticate, async (req, res) => {
  try {
    const { subcategory } = req.params;
    const { userId } = req.body; // Get the user ID to remove from request body
    
    const community = await Subcategory.findOne({ slug: subcategory });
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if user is a member
    if (!community.members.includes(userId)) {
      return res.status(400).json({ message: 'Not a member of this community' });
    }
    
    // Remove user from community members
    community.members = community.members.filter(
      member => member.toString() !== userId.toString()
    );
    await community.save();
    
    return res.status(200).json({
      message: 'Successfully removed member from the community'
    });
  } catch (error) {
    console.error('Error removing community member:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


export default router;