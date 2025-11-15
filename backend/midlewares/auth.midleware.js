import userModel from "../models/user.model.js";
import captainModel from "../models/captain.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import blacklistTokenModel from "../models/blacklistToken.model.js";
const authUser=async(req,res,next)=>{
    const token =req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log('Auth Middleware - Token:', token);
    if (!token) {
        return res.status(401).json({message:'unauthorized,no token provided'});
    }
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        // console.log('Token is blacklisted');
        return res.status(401).json({ message: 'unauthorized, token is blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

// Handle both 'id' or '_id' from token
const userId = decoded._id || decoded.id;

if (!userId) {
  return res.status(401).json({ message: "Invalid token: no user ID" });
}

req.user = await userModel.findById(userId);

if (!req.user) {
  return res.status(404).json({ message: "User not found" });
}

console.log("✅ Authenticated User ID:", req.user._id);
next();
    } catch (error) {
        return res.status(401).json({ message:'unauthorized'});
    }}
const authCaptain=async(req,res,next)=>{
    const token =req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({message:'unauthorized,no token provided'});
    }   
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ message: 'unauthorized, token is blacklisted' });
    } 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captainId = decoded._id || decoded.id;
        if (!captainId) {
          return res.status(401).json({ message: "Invalid token: no captain ID" });
        }
        const captain = await captainModel.findById(captainId);
        if (!captain) {
          return res.status(404).json({ message: "Captain not found" });
        }
        req.captain = captain;
        
        return next();
    } catch (error) {
        return res.status(401).json({ message:'unauthorized'});
    }}

    const authMiddleware={authUser,authCaptain};
    export default authMiddleware;