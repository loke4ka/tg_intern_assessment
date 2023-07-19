const {Telegraf, Markup} = require('telegraf');
const session = require('telegraf-session-local');
const mongoose = require('mongoose');
const {startHandler} = require('./domains/telegram');
const {markIntern, putMark, showTopUsers} = require('./domains/admin');
const {telegramToken, mongodbUrl} = require('./domains/config');

mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const bot = new Telegraf(telegramToken);
bot.use(new session());

bot.start(async (ctx) => {
    startHandler(ctx);
});

bot.action(/mark_/, async (ctx) => {
    markIntern(ctx);
});

bot.on('text', async (ctx) => {
    putMark(ctx);
});

bot.command('top', (ctx) => {
    showTopUsers(ctx);
});

bot.launch();


/*
// Ссылка на репозиторий
bot.on('text', (ctx) => {
    const {message} = ctx;
    const chatId = message.chat.id;

    const text = message.text;

    const sessionData = ctx.session;

    if (text) {

        if (!sessionData.projectName) {

            sessionData.projectName = text;

            ctx.reply('Пожалуйста, введите ссылку на репозиторий проекта.');
        } else if (!sessionData.repositoryUrl) {

            sessionData.repositoryUrl = text;

            const confirmationMessage = `Вы ввели следующие данные:\n\nНазвание проекта: ${sessionData.projectName}\nСсылка на репозиторий: ${sessionData.repositoryUrl}\n\nСпасибо!`;
            ctx.reply(confirmationMessage);
        }
    }
}); */

