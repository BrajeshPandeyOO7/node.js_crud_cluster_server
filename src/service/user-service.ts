import mongoose from "mongoose";
import UserModel, { IUser } from "../model/user-model";
import { BadRequestException, NotFoundException } from "../utility/custome-error";

export async function createUser(body: IUser): Promise<IUser> {
    const _user = new UserModel(body);
    const { message } = _user.validateSync() ?? {}; 
    if(message)throw new BadRequestException(message);
    return await _user.save();
}

export async function getAllUsers(): Promise<IUser[]> {
    return UserModel.find({}).exec();
}

export async function getUserById(_id: string | mongoose.Types.ObjectId): Promise<IUser> {
    let response = await UserModel.findById(_id).exec();
    if(!response)throw new NotFoundException("record does not exist!");
    return response;
}

export async function updateUserById(_id:string | mongoose.Types.ObjectId, body: Partial<IUser>): Promise<IUser> {
    const update_record = await UserModel.findOneAndUpdate({_id}, {$set: body}, { new: true}).exec();
    if(!update_record)throw new NotFoundException("record does not exist!");
    return update_record;
}

export async function deleteUserById(_id:string) {
    const { deletedCount } = await UserModel.deleteOne({_id}).lean().exec();
    if(!deletedCount)throw new NotFoundException("record does not exist!");
}