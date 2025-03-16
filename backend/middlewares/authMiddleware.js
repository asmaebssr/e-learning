import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authenticate = async(req, res, next) => {
    let token;

    // read the JWT from the jwt cookie
    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed.')
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token.')
    }
}


export { authenticate };