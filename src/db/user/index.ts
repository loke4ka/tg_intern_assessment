import mongoose, {Document, Schema, model} from "mongoose";

export interface IUser extends Document {
    chatId: any;
    firstName: string;
    lastName: string;
    role: string;
}

const userSchema = new Schema<IUser>({
    chatId: {type: Number, required: true, unique: true},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    role: {type: String, default: "intern"},
});

export const User = model<IUser>("User", userSchema);

