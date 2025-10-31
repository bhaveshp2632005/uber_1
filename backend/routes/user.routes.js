import express from 'express';
const router= express.Router();
import {body, validationResult} from 'express-validator';
import userController from '../controllers/user.controller.js';
// Define your user routes here
router.post('/register', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')],userController.registerUser);


export default router;