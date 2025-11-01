import captainModel from "../models/captain.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import captainService from "../services/captain.service.js"; 
import { validationResult } from "express-validator";
import blacklistTokenModel from "../models/blacklistToken.model.js";


const registerCaptain = async (req, res, next) => {const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}
const loginCaptain = async (req, res, next) => {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await captain.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = captain.generateAuthToken();
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ token, captain });
    } catch (error) {
        next(error);
    }
}
const getCaptainProfile = async (req, res, next) => {
    res.status(200).json({captain: req.captain});
}   
const logoutCaptain = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    await blacklistTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out successfully' });
}
const captainController = { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain };
export default captainController;
