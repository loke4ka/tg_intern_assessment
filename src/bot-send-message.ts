import {messageQueue} from "./domains/queues/send-message-queue";
import {Utils} from "./utils";


export const BotSendMessage = {
    async sendMessage(chatId: any, text: string) {
        await Utils.sleep(1000);
        await messageQueue.add({chatId, text});
    }
};

