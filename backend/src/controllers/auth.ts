import { Request, Response, NextFunction } from 'express';
import User from "../models/User";
import { registerUserSchema, loginUserSchema } from "../validations/User.validation";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { name, email, password } = req.body;
    const result = registerUserSchema.safeParse({ name, email, password });
    if(!result.success){
        return res.status(400).json({ 
            message: result.error.message 
        });
    }
    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({  
            message: "User already exists",
        })
    }
    const user = await User.create({ name, email, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token: token
    });
 return;
} catch (error) {
        res.status(500).json({
        message: "Internal server error",
    })
    return;
}
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = loginUserSchema.safeParse({ email, password });
        if(!result.success){
            return res.status(400).json({
                message: result.error.message,
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            })
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid credentials",
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token: token
        })
        return;
    }catch(error){
        res.status(500).json({
            message: "Internal server error",
        })
        return;
    }
}

export { registerUser, loginUser };