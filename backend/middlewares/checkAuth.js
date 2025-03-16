import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';

const checkAuth = async (req, res, next) => {
    console.log("edkzbfdhjezbfvzkjsqnbcdkjsqbf")
    let token = req.cookies.jwt;
  
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  
    try {
      console.log('Token:', token); // Debugging
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded:', decoded); // Debugging
  
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      req.user = user;
    res.send(user)
    } catch (error) {
      console.error('Token verification failed:', error); // Debugging
  
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
  
      res.status(401).json({ message: 'Not authorized, token failed.' });
    }
}
;

export default checkAuth