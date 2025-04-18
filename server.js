import express from "express"
import cors from "cors"
import connectDB from "./configs/db.js";
import 'dotenv/config'
import userRouter from "./route/userRoute.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
await connectDB()

const allowedOrigins = ['http://localhost:5173','http://localhost:4000'];

app.use(cors({
    origin: allowedOrigins, credentials: true
}));

app.get('/', (req, res) => {
    res.send("API IS WORKING");
})

app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
