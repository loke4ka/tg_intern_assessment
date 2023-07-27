import mongoose, {Document, Model, Schema, model} from "mongoose";

export interface IMark extends Document {
    userMarkId: number;
    adminMarkId: number;
    markType: string;
    mark: number;
    datetime: Date;
}

const markSchema = new Schema<IMark>({
    userMarkId: {type: Number, required: true},
    adminMarkId: {type: Number, required: true},
    markType: {type: String, required: true},
    mark: {type: Number, required: true, default: 0},
    datetime: {type: Date, default: Date.now},
});

export const Mark = model<IMark>("Mark", markSchema);

