const {readJsonFile, writeJsonFile} = require("./commands");
const cron = require("node-cron");

module.exports = (bot) => {
    function sendNotification(isDoubleBottle) {
        const data = readJsonFile();
        let text = '';
        if (isDoubleBottle !== true) {
            for (let i = 0; i < data.users.length; i++) {
                if (data.users[i].active === true) {
                    const userCup = (data.users[i].weight * 30) / 6;
                    text = `${data.users[i].name}, нужно выпить ${userCup} мл воды!`;
                    data.users[i].drankWater += userCup;
                    writeJsonFile(data);
                    bot.sendMessage(data.users[i].id, text);
                }
            }
        }
        else {
            for (let i = 0; i < data.users.length; i++) {
                if (data.users[i].active === true) {
                    const userCup = (data.users[i].weight * 30) / 6;
                    text = `${data.users[i].name}, нужно выпить ${userCup * 2} мл воды!`;
                    data.users[i].drankWater += userCup * 2;
                    writeJsonFile(data);
                    bot.sendMessage(data.users[i].id, text);
                }
            }
        }
    }

    cron.schedule(`55 15 * * *`, async () => {
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
}
