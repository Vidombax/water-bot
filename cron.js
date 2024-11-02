const {getUsers, updateWaterData} = require('./store_user.js');
const cron = require("node-cron");

module.exports = (bot) => {
    function sendNotification(isDoubleBottle, whatTime) {
        console.log(`Начинаю cron: ${whatTime}`);
        let users = [];
        let text = '';
        (async () => {
            try {
                users = await getUsers(users);
            }
            catch (e) {
                console.error(e);
            }
        })().finally(() => {
            if (isDoubleBottle !== true) {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].active === true) {
                        const userCup = (users[i].weight * 30) / 6;
                        text = `${users[i].name}, нужно выпить ${userCup} мл воды!`;
                        (async () => {
                            try {
                                await updateWaterData(users[i].id_telegram, userCup);
                            }
                            catch (e) {
                                console.error(e);
                            }
                        })();

                        bot.sendMessage(users[i].id_telegram, text);
                    }
                }
                console.log(`Cron: ${whatTime} завершен`);
            }
            else {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].active === true) {
                        const userCup = (users[i].weight * 30) / 6;
                        text = `${users[i].name}, нужно выпить ${userCup * 2} мл воды!`;
                        (async () => {
                            try {
                                await updateWaterData(users[i].id_telegram, userCup * 2);
                            }
                            catch (e) {
                                console.error(e);
                            }
                        })();

                        bot.sendMessage(users[i].id_telegram, text);
                    }
                }
                console.log(`Cron: ${whatTime} завершен`);
            }
        });
    }

    cron.schedule(`0 7 * * *`, async () => {
        try {
            await sendNotification(false, '9:00');
        } catch (error) {
            console.error('Cron job failed:', error);
        }
    }, { scheduled: true, timezone: 'Europe/Moscow' });

    cron.schedule(`0 9 * * *`, async () => {
        try {
            await sendNotification(false, '11:00');
        } catch (error) {
            console.error('Cron job failed:', error);
        }
    }, { scheduled: true, timezone: 'Europe/Moscow' });

    cron.schedule(`0 11 * * *`, async () => {
        try {
            await sendNotification(true, '13:00');
        } catch (error) {
            console.error('Cron job failed:', error);
        }
    }, { scheduled: true, timezone: 'Europe/Moscow' });

    cron.schedule(`0 14 * * *`, async () => {
        try {
            await sendNotification(false, '16:00');
        } catch (error) {
            console.error('Cron job failed:', error);
        }
    }, { scheduled: true, timezone: 'Europe/Moscow' });

    cron.schedule(`0 18 * * *`, async () => {
        try {
            await sendNotification(false, '20:00');
        } catch (error) {
            console.error('Cron job failed:', error);
        }
    }, { scheduled: true, timezone: 'Europe/Moscow' });
}
