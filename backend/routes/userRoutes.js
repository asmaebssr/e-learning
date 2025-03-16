import express from "express";
import {getAllUsers,toggleAdmin, deleteUser, signup, login, logout, forgotPassword, resetPassword, updateUser, contact, learningPaths, OnelearningPath, OneTechnology} from "../controllers/userController.js"
import checkAuth from "../middlewares/checkAuth.js";
import { authenticate } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.delete('/:id', deleteUser)
router.get('/allUsers', getAllUsers)
router.put('/:userId/toggle-admin', toggleAdmin)
router.route('/').post(signup)
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', checkAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/update-user',authenticate, updateUser);
router.post('/contact', authenticate, contact);
router.get('/learning-paths', authenticate, learningPaths)
router.get('/learning-paths/:id', authenticate, OnelearningPath)
router.get('/learning-path/:pathId/technology/:techId', authenticate, OneTechnology)

export default router;