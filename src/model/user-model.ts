import mongoose, { Schema, model } from "mongoose";

export interface IUser {
    _id?: string | mongoose.Types.ObjectId;
    username: string;
    age: number;
    hobbies: string[];
}

const schema = new Schema({
    username : {
        type: Schema.Types.String,
        required: true
    },
    age: {
        type: Schema.Types.Number,
        required: true
    },
    hobbies: {
        type: [Schema.Types.String],
        required: true
    },
})

const UserModel = mongoose.models.users || model('users', schema);
export default UserModel;