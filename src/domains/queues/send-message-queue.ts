import Queue from 'bull';
import {Config} from "../config";
import {bot} from "../../bot";


export const messageQueue = new Queue('message-queue', {redis: Config.redisUrl});

messageQueue.process(async (job) => {
    console.log(`Processing job ${job.id}: ${JSON.stringify(job.data)}`);
    const {chatId, text} = job.data;

    try {
        await bot.telegram.sendMessage(chatId, text);
        console.log(`Message sent to ${chatId}`);
    } catch (error) {
        console.error(`Error sending message to ${chatId}: ${error}`);
    }
});
