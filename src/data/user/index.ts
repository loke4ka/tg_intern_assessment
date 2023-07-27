import {IUser, User} from "../../db/user";

export class UserData {
    public static async getUserByChatId(chatId: any) {
        return User.findOne({chatId});
    }

    public static async saveUser(newUser: IUser) {
        await newUser.save();
    }

    public static async getAllUsers() {
        return User.find({});
    }

}
