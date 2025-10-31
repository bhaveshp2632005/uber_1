import userModel from '../models/user.model.js';
import userService from '../services/user.services.js';
import { validationResult } from 'express-validator';
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
export default {registerUser};