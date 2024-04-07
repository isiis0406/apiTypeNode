import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { UserDocument } from "./user.model";

//Interface 
export interface SessionDocument extends mongoose.Document {
     user:  UserDocument['_id'],
    valid: boolean,
    userAgent: string,
    createdAt: Date,
    updatedAt: Date,
}

// Schema
const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
    
}, {
    timestamps: true
})

//Pre Save 

//Model
const SessionModel = mongoose.model<SessionDocument>('Session', sessionSchema);

export default SessionModel;
