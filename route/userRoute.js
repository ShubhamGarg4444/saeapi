import express from "express"
import { login, logout, RegisterUser } from "../controller/userController.js";
import multerUpload from "../configs/multer.js"

const userRouter = express.Router();

userRouter.post('/register', multerUpload.single("IdCard"), RegisterUser)
userRouter.post('/login', login)
// userRouter.get('/is-auth', authUser, isAuth)
userRouter.post('/logout', logout)


export default userRouter;