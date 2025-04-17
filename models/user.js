import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    password: { type: String, required: true },
    RollNo: { type: String, required: true },
    BarCode: { type: String, required: true },
    IdCard: {type:String, required:true}
})

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;