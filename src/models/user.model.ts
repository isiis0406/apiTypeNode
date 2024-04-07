import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

//Interface 
export interface UserDocument extends mongoose.Document {
    email: string,
    name: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    comparePassword(candidatePassword: string): Promise<boolean>
}

// Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: [true, 'Email is required!'], unique: [true, 'Email already used!'] },
    name: { type: String, required: [true, 'Name is required'] },
    password: { type: String, required: [true, 'Password is required'] }
}, {
    timestamps: true
})

//Pre Save 
//Hash password before saving
userSchema.pre("save", async function (next) {
    let user = this as UserDocument;
    if (!user.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
    const hash = await bcrypt.hashSync(user.password, salt);
    user.password = hash;
    return next();
})

//Compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
}


//Model
const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
