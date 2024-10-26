const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { addUser, readJsonFile } = require('./commands');
const cron = require("node-cron");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

function sendNotification(isDoubleBottle) {
    const data = readJsonFile();
    let text = '';
    if (isDoubleBottle !== true) {
        for (let i = 0; i < data.users.length; i++) {
            text = `${data.users[i].name}, пора выпить стакан воды🚰`;
            bot.sendMessage(data.users[i].id, text);
        }
    }
    else {
        for (let i = 0; i < data.users.length; i++) {
            text = `${data.users[i].name}, пора выпить два стакана воды🚰🚰`;
            bot.sendMessage(data.users[i].id, text);
        }
    }
}

cron.schedule(`30 6 * * *`, async () => {
    try {
        await sendNotification(false);
    } catch (error) {
        console.error('Cron job failed:', error);
    }
}, { scheduled: true, timezone: 'Europe/Moscow' });

cron.schedule(`* 9 * * *`, async () => {
    try {
        await sendNotification(false);
    } catch (error) {
        console.error('Cron job failed:', error);
    }
}, { scheduled: true, timezone: 'Europe/Moscow' });

cron.schedule(`* 11 * * *`, async () => {
    try {
        await sendNotification(true);
    } catch (error) {
        console.error('Cron job failed:', error);
    }
}, { scheduled: true, timezone: 'Europe/Moscow' });

cron.schedule(`* 14 * * *`, async () => {
    try {
        await sendNotification(false);
    } catch (error) {
        console.error('Cron job failed:', error);
    }
}, { scheduled: true, timezone: 'Europe/Moscow' });

cron.schedule(`* 18 * * *`, async () => {
    try {
        await sendNotification(false);
    } catch (error) {
        console.error('Cron job failed:', error);
    }
}, { scheduled: true, timezone: 'Europe/Moscow' });


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;


    switch (text) {
        case '/start':
            const data = readJsonFile();
            let userFound = false;

            for (let i = 0; i < data.users.length; i++) {
                if (data.users[i].id === msg.chat.id) {
                    bot.sendMessage(chatId, 'Вы уже зарегистрированы!');
                    userFound = true;
                    break;
                }
            }

            if (!userFound) {
                const newUser = {
                    id: msg.chat.id,
                    name: msg.chat.first_name,
                };
                addUser(newUser);
                bot.sendMessage(chatId, 'Бот будет отправлять по расписанию сообщение о том, что нужно выпить воды!');
            }
            break;
        case '/about':
            bot.sendMessage(chatId, 'Данный бот отправляет уведомление о нужде выпить воды по такому расписанию:' +
                '\n' +
                ' 8:30' +
                '\n' +
                '11:00' +
                '\n' +
                '13:00' +
                '\n' +
                '16:00' +
                '\n' +
                '20:00');
            break;
        case '/refuse':
            const dataUsers = readJsonFile();
            break;
    }
});