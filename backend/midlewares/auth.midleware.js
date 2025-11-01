import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import blacklistTokenModel from "../models/blacklistToken.model.js";
const authUser=async(req,res,next)=>{
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
        req.user = await userModel.findById(decoded.id);
        returnnext();
    } catch (error) {
        return res.status(401).json({ message:'unauthorized'});
    }}
    const authMiddleware={authUser};
    export default authMiddleware;