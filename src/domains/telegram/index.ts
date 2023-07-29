import {User, IUser} from '../../db/user';
import {Mark, IMark} from '../../db/mark';

import {MarkData} from "../../data/mark";
import {UserData} from "../../data/user";
import {InlineKeyboardButton} from "telegraf/typings/markup";
import {bot} from "../../bot";
import {BotSendMessage} from "../../bot-send-message";
import {messageQueue} from "../queues/send-message-queue";
import {session} from "telegraf";

export class Telegram {
    public static async startHandler(ctx: any) {
        const {message}: any = ctx;
        const chatId: number = message.chat.id;
        const firstName: string = message.from.first_name;
        const lastName: string = message.from.last_name;

        const existingUser = await UserData.getUserByChatId(chatId);

        if (existingUser) {
            //Вы уже зарегистрированы!
            // addToQueue(chatId, 'Вы уже зарегистрированы!')
            await BotSendMessage.sendMessage(chatId, 'Вы уже зарегистрированы!');
        } else {
            const newUser: IUser = new User({chatId, firstName, lastName});
            await UserData.saveUser(newUser);
            //ctx.reply('Регистрация успешно завершена!');
            await BotSendMessage.sendMessage(chatId, 'Регистрация успешно завершена!');
        }

        if (existingUser && existingUser.role === 'admin') {
            //ctx.reply('Вы администратор!');
            await BotSendMessage.sendMessage(chatId, 'Вы администратор!');
        }

        const users = await UserData.getAllUsers();
        const inlineKeyboards: InlineKeyboardButton[][] = []
        for (const user of users) {
            const inlineKeyboard: InlineKeyboardButton[] = [
                {
                    text: `${user?.firstName || ""} ${user?.lastName || ""}`,
                    callback_data: `mark_${user.chatId}`,
                    hide: false
                }
            ]
            inlineKeyboards.push(inlineKeyboard)
        }
        ctx.reply('Выберите пользователя:', {
            reply_markup: {
                inline_keyboard: inlineKeyboards
            },
        });
    }

    public static async markIntern(ctx: any) {
        const {callbackQuery}: any = ctx;

        const userName: string = callbackQuery.data;
        const evaluatorId: number = ctx.from.id;
        const regExp = /mark_/g;
        const userChatId: string = userName.replace(regExp, '');

        console.log(userChatId);

        const user: any = await UserData.getUserByChatId(userChatId);

        ctx.session.userChatId = userChatId;
        ctx.session.user = user;
        ctx.session.evaluatorId = evaluatorId;
        ctx.session.step = 0;
        this.nextCategory(ctx);
    }

    public static async nextCategory(ctx: any) {
        const {session}: any = ctx;
        const categories: string[] = ['Functional', 'UI/UX', 'Code'];
        const currentStep: number = session.step || 0;

        if (currentStep >= categories.length) {
            await BotSendMessage.sendMessage(session.evaluatorId, 'Вы оценили все категории!');
            //ctx.reply('Вы оценили все категории!');
            this.showTopUsers(ctx);
            return;
        }


        const currentCategory: string = categories[currentStep];
        session.currentCategory = currentCategory;
        session.step = currentStep + 1;

        try {
            await BotSendMessage.sendMessage(session.evaluatorId, `Оцените пользователя ${session?.user?.firstName || ""} ${session?.user?.lastName || ""} по 10-балльной шкале для категории ${currentCategory}.`);
            //ctx.reply(`Оцените пользователя ${session?.user?.firstName || ""} ${session?.user?.lastName || ""} по 10-балльной шкале для категории ${currentCategory}.`);
        } catch (e) {
            console.log(e)
        }
    }

    public static async putMark(ctx: any) {
        const {message, session}: any = ctx;
        const markValue: number = parseInt(message.text, 10);

        if (isNaN(markValue) || markValue < 1 || markValue > 10) {
            ctx.reply('Пожалуйста, введите числовую оценку от 1 до 10.');
            return;
        }

        const {user, evaluatorId, currentCategory} = session;

        if (!user || !evaluatorId || !currentCategory) {
            ctx.reply('Произошла ошибка. Пожалуйста, попробуйте снова.');
            return;
        }

        const mark: IMark = new Mark({
            userMarkId: user.chatId,
            adminMarkId: evaluatorId,
            markType: currentCategory,
            mark: markValue,
        });

        MarkData.saveMark(mark);
        this.nextCategory(ctx);

    }

    public static async showTopUsers(ctx: any) {


        const chatId: string = ctx.chat.id;
        let existingUser = await UserData.getUserByChatId(chatId);

        console.log(chatId, existingUser);

        // @ts-ignore
        if (existingUser.role == "admin") {
            const topUsers = await MarkData.topInternByMarkSum();
            if (topUsers.length > 0) {
                const resultMessage = topUsers
                    .map((user, index) => `${index + 1}. ${user?.firstName || ""} ${user?.lastName || ""}: ${user.totalRating}`)
                    .join('\n');
                ctx.reply(`Топ пользователей по наивысшей оценке:\n\n${resultMessage}`);
            } else {
                ctx.reply('Нет данных для отображения');
            }
        } else {
            await BotSendMessage.sendMessage(chatId, 'Вы не админ! Оценки не доступны');
        }
    }
}
