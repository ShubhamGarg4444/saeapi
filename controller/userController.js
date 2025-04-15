import User from "../models/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const RegisterUser = async (req, res) => {
    try {
        console.log("testing..")
        const { Name, RollNo, BarCode, password } = req.body;
        const newUser = new User({
            Name, RollNo, BarCode, password
        });
        const existingUser = await User.findOne({ RollNo });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }
        await newUser.save();
        res.status(201).json({ message: "Data saved successfully", data: newUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const login = async (req, res) => {

    try {

        const { RollNo, password } = req.body;

        if (!RollNo) {
            return res.json({ success: false, message: " roll no is required" })
        }

        const user = await User.findOne({ RollNo })

        if (!user) {
            return res.json({ success: false, message: "Invalid email or password" })
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true })

    } catch (error) {

        console.log(error.message)
        return res.json({ success: false, message: error.message })

    }
}

export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.json({ success: true, message: "Logged out successfully" })

    } catch (error) {

        console.log(error.message)
        return res.json({ success: false, message: error.message })

    }
}