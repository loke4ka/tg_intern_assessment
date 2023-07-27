import {Telegraf} from "telegraf";

const session = require('telegraf-session-local');
import {Telegram} from "./domains/telegram";

import {Config} from "./domains/config";
import initDatabase from './db/init-database';

initDatabase();

export const bot = new Telegraf(Config.telegramToken);
bot.use(new session());


bot.start(async (ctx: any) => {
    console.log('new new ver');
    await Telegram.startHandler(ctx);
});

bot.action(/mark_/, async (ctx: any) => {
    await Telegram.markIntern(ctx);
});

bot.on('text', async (ctx: any) => {
    await Telegram.putMark(ctx);
});

bot.command('top', (ctx: any) => {
    Telegram.showTopUsers(ctx);
});

bot.launch();
