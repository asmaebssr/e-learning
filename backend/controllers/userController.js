import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import crypto from 'crypto';
import { sendContactEmail, sendResetPasswordEmail, sendResetSuccessEmail } from "../mailer/emails.js";
import LearningPath from "../models/learningPathModel.js";

// signup:
const signup = async(req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || ! email || !password) {
        throw new Error('Please fill all the inputs!');
    };

    const userExists = await User.findOne({email});
    if (userExists) res.status(400).send('User already exists!');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });

    try {

        await newUser.save();
        createToken(res, newUser._id);

        res.status(201).json({
            _id: newUser._id, 
            username: newUser.username,
            email: newUser.email, 
            isAdmin: newUser.isAdmin
        });

    } catch (error) {
        res.status(400);
        throw new Error('Invalid user data')
    }
};

// login:
const login = async(req, res) => {
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);

            if (isPasswordValid) {
                createToken(res, existingUser._id);

                res.status(201).json({
                    _id: existingUser._id, 
                    username: existingUser.username,
                    email: existingUser.email, 
                    isAdmin: existingUser.isAdmin
                });

                return;
            }
        }
        
        // If we reach here, either user doesn't exist or password is invalid
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
        
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again later.'
        });
    }
};


// logout:
const logout = async(req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            expires: new Date(0),
        });

        res.status(200).json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed. Please try again later.'
        });
    }
};

// forgot pswrd
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        };
 
        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        await sendResetPasswordEmail(
            user.email, 
            `http://localhost:5173/reset-password/${resetToken}`
        );
        

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });

    } catch (error) {
        console.log('Error in forgotPassword', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

// reset pswrd
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        console.log('Token:', token);
        console.log('Password:', password);

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();  // Await the save operation

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });

    } catch (error) {
        console.log('Error in resetPassword', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// update user infos
const updateUser = async(req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);        
            user.password = hashedPassword;
        };

        const updateUser = await user.save();

        res.json({
            _id: updateUser._id,
            username: updateUser.username,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    };
};

// send us a message
const contact = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user) {
            const { name, email, message } = req.body;
            
            // Validate inputs
            if (!name || !email || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide name, email and message'
                });
            }
            
            // Send the contact email
            await sendContactEmail(name, email, message);
            
            return res.status(200).json({
                success: true,
                message: 'Contact email sent successfully'
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
    } catch (error) {
        console.error('Contact form submission error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send contact email'
        });
    }
}

// these shouldn't be here, I'll handle this madness later
const learningPaths = async (req, res) => {
    try {
      const learningPaths = await LearningPath.find({});
      res.status(200).json(learningPaths);
    } catch (error) {
      res.status(500).json({ message: "Error fetching learning paths" });
    }
};

const OnelearningPath = async (req, res) => {
    try {
      const pathId = req.params.id;
      const learningPath = await LearningPath.findById(pathId);
      
      if (!learningPath) {
        return res.status(404).json({ message: 'Learning path not found' });
      }
      
      res.json(learningPath);
    } catch (error) {
      console.error('Error fetching learning path:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

const OneTechnology = async (req, res) => {
    try {
      const learningPath = await LearningPath.findById(req.params.pathId);
      if (!learningPath) {
        return res.status(404).json({ message: "Learning path not found" });
      }
  
      const technology = learningPath.technologies.id(req.params.techId);
      if (!technology) {
        return res.status(404).json({ message: "Technology not found" });
      }
  
      res.json({ 
        learningPath: {
          _id: learningPath._id,
          category: learningPath.category,
          subcategory: learningPath.subcategory,
          description: learningPath.description
        },
        technology 
      });
    } catch (error) {
      console.error("Error fetching technology:", error);
      res.status(500).json({ message: "Server error" });
    }
};

// get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
      }
}

// delete user for admin
const deleteUser =  async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", User: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// change the user status
const toggleAdmin =  async (req, res) => {
    const { userId } = req.params;
    const { isAdmin } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.isAdmin = isAdmin;
      await user.save();
  
      res.status(200).json(user);
    } catch (err) {
      console.error('Error toggling admin status:', err);
      res.status(500).json({ message: 'Failed to update admin status' });
    }
  };


export {
    toggleAdmin,
    getAllUsers,
    deleteUser,
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
    contact,
    learningPaths,
    OnelearningPath,
    OneTechnology
}