import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.pre("save", async function (next){
    try{
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
} catch (error) {
    next(error as Error);
}
});

interface IUserMethods {
    matchPassword(enteredPassword: string): Promise<boolean>;
}

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

interface IUser {
    name: string;
    email: string;
    password: string;
}

const User = mongoose.model<IUser & Document & IUserMethods>("User", userSchema);

export default User;