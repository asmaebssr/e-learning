import mongoose from "mongoose";
import User from "../models/userModel.js"
import Post from "../models/PostModel.js"
import bcrypt from 'bcryptjs';

const seedPosts = async () => {
    try {
      // Connect to MongoDB
      await mongoose.connect('mongodb://localhost:27017/e-learning', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
  
      // Check if a user exists, if not create one
      let user = await User.findOne({ email: 'example@test.com' });
      
      if (!user) {
        // Create a new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
  
        user = new User({
          username: 'johndoe',
          email: 'example@test.com',
          password: hashedPassword,
          isAdmin: false,
          enrolledPaths: [], // You can add learning path IDs if needed
          resetPasswordToken: null,
          resetPasswordExpiresAt: null
        });
  
        await user.save();
        console.log('User created');
      }
  
      // Clear existing posts
      await Post.deleteMany({});
  
      // Sample posts data
      const posts = [
        {
          user: user._id,
          title: 'My First Blog Post',
          text: 'This is the content of my first blog post. Welcome to my blog!',
          image: 'https://example.com/image1.jpg',
          likes: [],
          comments: [
            {
              user: user._id,
              text: 'Great post!',
              name: user.username,
              avatar: '', // You might want to add avatar handling
              likes: [],
              replies: []
            }
          ]
        },
        {
          user: user._id,
          title: 'Another Exciting Post',
          text: 'Here\'s another interesting blog post to read.',
          image: 'https://example.com/image2.jpg',
          likes: [],
          comments: []
        }
      ];
  
      // Insert posts
      await Post.insertMany(posts);
  
      console.log('Posts seeded successfully');
      mongoose.connection.close();
    } catch (error) {
      console.error('Error seeding posts:', error);
      mongoose.connection.close();
    }
  };

seedPosts();