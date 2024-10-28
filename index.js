const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { addUser, readJsonFile, writeJsonFile } = require('./commands');
const cron = require("node-cron");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

function sendNotification(isDoubleBottle) {
    const data = readJsonFile();
    let text = '';
    if (isDoubleBottle !== true) {
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].active === true) {
                const userCup = (data.users[i].weight * 30) / 6;
                text = `${data.users[i].name}, нужно выпить ${userCup} мл воды!`;
                bot.sendMessage(data.users[i].id, text);
            }
        }
    }
    else {
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].active === true) {
                const userCup = (data.users[i].weight * 30) / 6;
                text = `${data.users[i].name}, нужно выпить ${userCup * 2} мл воды!`;
                bot.sendMessage(data.users[i].id, text);
            }
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

cron.schedule(`0 9 * * *`, async () => {
    try {
        await sendNotification(false);
    } catch (error) {
        console.error('Cron job failed:', error);
    }
}, { scheduled: true, timezone: 'Europe/Moscow' });

cron.schedule(`0 11 * * *`, async () => {
    try {
        await sendNotification(true);
    } catch (error) {
        console.error('Cron job failed:', error);
    }
}, { scheduled: true, timezone: 'Europe/Moscow' });

cron.schedule(`0 14 * * *`, async () => {
    try {
        await sendNotification(false);
    } catch (error) {
        console.error('Cron job failed:', error);
    }
}, { scheduled: true, timezone: 'Europe/Moscow' });

cron.schedule(`0 18 * * *`, async () => {
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
                if (data.users[i].id === chatId) {
                    if (data.users[i].active === true) {
                        bot.sendMessage(chatId, 'Вы уже зарегистрированы!');
                        userFound = true;
                        break;
                    }
                    else {
                        data.users[i].active = true;
                        writeJsonFile(data);
                        bot.sendMessage(chatId, 'С возвращением!');
                        userFound = true;
                    }
                }
            }

            if (!userFound) {
                bot.sendMessage(chatId, 'Добро пожаловать! Пожалуйста, укажите ваш рост в см:');
                bot.once('message', (msg) => {
                    const height = parseInt(msg.text);
                    if (isNaN(height)) {
                        bot.sendMessage(chatId, 'Пожалуйста, введите числовое значение для роста.');
                        return;
                    }

                    bot.sendMessage(chatId, 'Спасибо! Теперь укажите ваш вес в кг:');
                    bot.once('message', (msg) => {
                        const weight = parseInt(msg.text);
                        if (isNaN(weight)) {
                            bot.sendMessage(chatId, 'Пожалуйста, введите числовое значение для веса.');
                            return;
                        }

                        const newUser = {
                            id: msg.chat.id,
                            name: msg.chat.first_name,
                            height: height,
                            weight: weight,
                            active: true,
                        };
                        addUser(newUser);
                        bot.sendMessage(chatId, `Человеку необходимо пить 30 мл жидкости на 1 кг массы тела, следовательно учитывая ваш вес вы должны пить: ${30 * newUser.weight} мл в день или же ${(30 * newUser.weight) / 1000} л в день.`);
                        bot.sendMessage(chatId, 'Бот будет отправлять в течении дня напоминания о том, что вам нужно выпить воды, чтобы вы смогли достичь своей суточной нормы жидкости в организме!');
                    });
                });
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
            let found = false;
            for (let i = 0; i < dataUsers.users.length; i++) {
                if (chatId === dataUsers.users[i].id) {
                    if (dataUsers.users[i].active === true) {
                        dataUsers.users[i].active = false;
                        writeJsonFile(dataUsers);
                        bot.sendMessage(chatId, 'Бот больше не будет отправлять вам сообщения');
                    } else {
                        bot.sendMessage(chatId, 'Бот не включен у вас');
                    }
                    found = true;
                    break;
                }
            }
            if (!found) {
                bot.sendMessage(chatId, 'Пользователь не найден');
            }
            break;
    }
});
