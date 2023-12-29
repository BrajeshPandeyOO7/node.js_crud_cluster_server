import UserModel, { IUser } from "../model/user-model";
import { BadRequestException } from "../utility/custome-error";

export async function createUser(body: IUser): Promise<IUser> {
    const _user = new UserModel(body);
    const { message } = _user.validateSync() ?? {}; 
    if(message)throw new BadRequestException(message);
    return await _user.save();
}