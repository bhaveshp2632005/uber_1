import userModel from '../models/user.model.js';
import userService from '../services/user.services.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import blacklistTokenModel from '../models/blacklistToken.model.js';

 const registerUser = async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
    }
    const hashedPassword = await userModel.hashPassword(password);
    try {
        const user = await userService.createUser({
            firstname:fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });
        const token = user.generateAuthToken();
        res.status(201).json({token,user});
    } catch (error) {
        next(error);
    }
}
const loginUser=async(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = user.generateAuthToken();
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({token,user});

}
    catch (error) {
        next(error);
    }}
const getUserProfile=async(req,res,next)=>{
    console.log('Fetching user profile for:', req.user);
    res.status(200).json(req.user);

}
const logoutUser=async(req,res,next)=>{
    res.clearCookie('token');
    const token=req.cookies.token || req.headers.authorization.split(" ")[1];
    await blacklistTokenModel.create({token});
    res.status(200).json({message:'Logged out successfully'});

}

    
export default {registerUser,loginUser,getUserProfile,logoutUser};