import { omit } from "lodash";
import UserModel, { UserDocument } from "../models/user.model";
import { FilterQuery } from "mongoose";

//Interface
export interface UserInput {
    name: string;
    password: string;
    email: string;
    passwordConfirmation: string;
}
//Create user
export const createUser = async (input: UserInput) => {
    try {
        return UserModel.create(input);
    } catch (e: any) {
        throw new Error(e);
    }
} 

//Validate user password
export const validatePassword = async ({email, password}: {email: string, password: string}) => {
    const user = await UserModel.findOne({email});
    if (!user) {
        return false;
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
        return false;
    }
    return omit(user.toJSON(), "password");
}

//Find user
export const findUser = async (query:FilterQuery<UserDocument>) => {
    return UserModel.findOne(query).lean();
}