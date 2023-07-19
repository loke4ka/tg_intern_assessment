// welcome.js
const {Telegraf} = require("telegraf");
const {User} = require('../../db/user/')
const {Mark} = require('../../db/mark/')

const startHandler = async (ctx) => {
    const {message} = ctx;
    const chatId = message.chat.id;
    const firstName = message.from.first_name;
    const lastName = message.from.last_name;

    const existingUser = await User.findOne({firstName, lastName, chatId});

    if (existingUser) {
        ctx.reply('Вы уже зарегистрированы!');
    } else {
        const newUser = new User({chatId, firstName, lastName});
        await newUser.save();
        ctx.reply('Регистрация успешно завершена!');
    }

    if (existingUser && existingUser.role === 'admin') {
        ctx.reply('Вы администратор!');

        const users = await User.find({});

        const inlineKeyboards = []
        for (const user of users) {
            const inlineKeyboard = [
                {
                    text: `${user?.firstName || ""} ${user?.lastName || ""}`,
                    callback_data: `mark_${user.chatId}`
                }
            ]

            inlineKeyboards.push(inlineKeyboard)
        }

        ctx.reply('Выберите пользователя:', {
            reply_markup: {
                inline_keyboard: inlineKeyboards
            },
        });

        console.log(ctx.callback_query)
    }
};

module.exports = {startHandler};

