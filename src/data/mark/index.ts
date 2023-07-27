import {User} from "../../db/user";
import {IMark} from "../../db/mark";

export class MarkData {
    public static async getMarkByChatId(chatId:number) {

    }

    public static async saveMark(mark:IMark) {
        await mark.save();
    }

    public static async topInternByMarkSum() {
        return User.aggregate([
            {
                $lookup: {
                    from: 'marks',
                    localField: 'chatId',
                    foreignField: 'userMarkId',
                    as: 'marks',
                },
            },
            {
                $addFields: {
                    totalRating: {$sum: '$marks.mark'},
                },
            },
            {
                $sort: {
                    totalRating: -1,
                },
            },
            {
                $limit: 10,
            },
        ]);
    }
}