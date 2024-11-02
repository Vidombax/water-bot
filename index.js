const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const server = require('./server.js');
const cron = require('./cron.js');
const {getUsers, updateActivity, addUser} = require('./store_user.js');

let token;

if (process.env.IS_TEST !== 'true') {
    token = process.env.BOT_TOKEN;
}
else {
    token = process.env.BOT_TOKEN_TEST;
}

const bot = new TelegramBot(token, {polling: true});

server();
cron(bot);

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    let users = [];

    switch (text) {
        case '/start':
            let userFound = false;

            (async () => {
                try {
                    users = await getUsers(users);
                }
                catch (e) {
                    console.error(e);
                }
            })().finally(() => {
                if (users.length > 1) {
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].id_telegram === chatId) {
                            if (users[i].active === true) {
                                bot.sendMessage(chatId, 'Вы уже зарегистрированы!');
                                userFound = true;
                                break;
                            }
                            else {
                                (async () => {
                                    try {
                                        await updateActivity(chatId, true);
                                    }
                                    catch (e) {
                                        console.error(e);
                                    }
                                })();
                                bot.sendMessage(chatId, 'С возвращением!');
                                userFound = true;
                            }
                        }
                    }
                }
                else {
                    if (users[0].id_telegram === chatId) {
                        if (users[0].active === true) {
                            bot.sendMessage(chatId, 'Вы уже зарегистрированы!');
                            userFound = true;
                        }
                        else {

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

                            let newUser = {};

                            (async () => {
                                newUser = {
                                    idTelegram: msg.chat.id,
                                    name: msg.chat.first_name,
                                    height: height,
                                    weight: weight,
                                    drankWater: 0,
                                };

                                await addUser(newUser);
                            })().finally(() => {
                                bot.sendMessage(chatId, `Человеку необходимо пить 30 мл жидкости на 1 кг массы тела, следовательно учитывая ваш вес вы должны пить: ${30 * newUser.weight} мл в день или же ${(30 * newUser.weight) / 1000} л в день.`);
                                bot.sendMessage(chatId, 'Бот будет отправлять в течении дня напоминания о том, что вам нужно выпить воды, чтобы вы смогли достичь своей суточной нормы жидкости в организме!');
                            });
                        });
                    });
                }
            });
            break;
        case '/about':
            bot.sendMessage(chatId, 'Данный бот отправляет уведомление о нужде выпить воды по такому расписанию:' +
                '\n' +
                '9:00' +
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
            (async () => {
                try {
                    users = await getUsers(users);
                }
                catch (e) {
                    console.error(e);
                }
            })().finally(() => {
                let found = false;
                for (let i = 0; i < users.length; i++) {
                    if (chatId === users[i].id_telegram) {
                        if (users[i].active === true) {
                            (async () => {
                                try {
                                    await updateActivity(chatId, false);
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            })();
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
            });
            break;
        case '/water':
            (async () => {
                try {
                    users = await getUsers(users);
                }
                catch (e) {
                    console.error(e);
                }
            })().finally(() => {
                if (users.length > 0) {
                    for (let i = 0; i < users.length; i++) {
                        if (chatId === users[i].id_telegram) {
                            if (users[i].active === true) {
                                bot.sendMessage(chatId, `Вы выпили ${users[i].drank_water} мл воды`);
                                break;
                            }
                            else {
                                bot.sendMessage(chatId, 'Вы не зарегистрированы в боте: чтобы это сделать выберите команду start в списке!');
                            }
                        }
                    }
                }
                else {
                    console.error('База данных пустая! нужен хелп разраба');
                }
            });
    }
});
