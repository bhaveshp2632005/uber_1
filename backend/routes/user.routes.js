import express from 'express';
const router= express.Router();
import {body, validationResult} from 'express-validator';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../midlewares/auth.midleware.js'; 
// Define your user routes here
router.post('/register', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')],userController.registerUser);


router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')],userController.loginUser);

router.get('/profile',authMiddleware.authUser,userController.getUserProfile); 
router.get('/logout',authMiddleware.authUser,userController.logoutUser);

export default router;