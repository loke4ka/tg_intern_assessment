const {User} = require("../../db/user");
const {Mark} = require('../../db/mark/')
const {Telegraf} = require("telegraf");
const mongoose = require('mongoose');
const session = require('telegraf-session-local');

const markIntern = async (ctx) => {
    const {callbackQuery} = ctx;
    const userName = callbackQuery.data;
    const evaluatorId = ctx.from.id;
    const regExp = /mark_/g;
    const userChatId = userName.replace(regExp, '');

    console.log(userChatId);

    const user = await User.findOne({
        chatId: userChatId
    });

    ctx.session.user = user;
    ctx.session.evaluatorId = evaluatorId;
    ctx.session.step = 0;
    nextCategory(ctx);
}


const nextCategory = async (ctx) => {
    const {session} = ctx;
    const categories = ['Functional', 'UI/UX', 'Code'];
    const currentStep = session.step || 0;

    if (currentStep >= categories.length) {
        ctx.reply('Вы оценили все категории!');
        showTopUsers(ctx);
        return;
    }

    const currentCategory = categories[currentStep];
    session.currentCategory = currentCategory;
    session.step = currentStep + 1;

    try {
        ctx.reply(`Оцените пользователя ${session?.user?.firstName || ""} ${session?.user?.lastName || ""} по 10-балльной шкале для категории ${currentCategory}.`);
    } catch (e) {
        console.log(e)
    }
};

const putMark = async (ctx) => {
    const {message, session} = ctx;
    const markValue = parseInt(message.text, 10);

    if (isNaN(markValue) || markValue < 1 || markValue > 10) {
        ctx.reply('Пожалуйста, введите числовую оценку от 1 до 10.');
        return;
    }

    const {user, evaluatorId, currentCategory} = session;

    if (!user || !evaluatorId || !currentCategory) {
        ctx.reply('Произошла ошибка. Пожалуйста, попробуйте снова.');
        return;
    }

    const mark = new Mark({
        userMarkId: user.chatId,
        adminMarkId: evaluatorId,
        markType: currentCategory,
        mark: markValue,
    });

    await mark.save();
    nextCategory(ctx);
}

const showTopUsers = async (ctx) => {
    const topUsers = await User.aggregate([
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

    if (topUsers.length > 0) {
        const resultMessage = topUsers
            .map((user, index) => `${index + 1}. ${user?.firstName || ""} ${user?.lastName || ""}: ${user.totalRating}`)
            .join('\n');
        ctx.reply(`Топ пользователей по наивысшей оценке:\n\n${resultMessage}`);
    } else {
        ctx.reply('Нет данных для отображения');
    }
}

module.exports = {markIntern, putMark, showTopUsers};
