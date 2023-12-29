import mongoose from "mongoose";

export const validateObjectId = (_id: string | mongoose.Types.ObjectId) => {
    return mongoose.isValidObjectId(_id);
}