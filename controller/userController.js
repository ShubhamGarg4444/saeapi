import User from "../models/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cloudinary from "../configs/cloudinary.js"

export const RegisterUser = async (req, res) => 
  {
    try {
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
  
  
        const { Name, RollNo, BarCode, password } = req.body;
        console.log(req.body);
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(req.file);
        const ImageURL = result.secure_url;
        console.log(ImageURL);
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        const newUser = new User({
          Name,
          RollNo,
          BarCode,
          password: hashedPassword,
          IdCard: ImageURL,
        });
  
        const existingUser = await User.findOne({ RollNo });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "User already exists. Please sign in to continue.",
          });
        }
  
        await newUser.save();
        res.status(201).json({
          message: "Data saved successfully",
          data: newUser,
        });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        message: "Internal server error",
        error
      });
    }
  };

export const login = async (req, res) => {

    try {

        const { RollNo, password } = req.body;

        if (!password) {
          return res.status(400).json({
            success: false,
            message: "Password is required",
          });
        }        
        console.log(password);
        if (!RollNo) {
            return res.json({ success: false, message: " roll no is required" })
        }
        console.log(RollNo);
        const user = await User.findOne({ RollNo })

        if (!user) {
            return res.json({ success: false, message: "Couldn't find User." })
        }
        console.log("found user");
        const isValidPassword = await bcrypt.compare(password , user.password)

        if (!isValidPassword){
            return res.status(401).send('Invalid Password!');
        }
        console.log("compared passwords.");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true , message:"Login successful!" })

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