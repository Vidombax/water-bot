const route = require("./route");
const cron = require("node-cron");
const axios = require("axios");
const express = require("express");

module.exports = () => {
    const app = express();

    app.use(express.json());
    app.use('/', route);
    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    if (process.env.IS_TEST === 'true') {
        console.log('Работает тестовый слой бота пинг на сервер не совершаем...');
    }
    else {
        console.log('Работает продовский слой бота пинг на сервер совершаем...');

        cron.schedule(`*/2 * * * *`, async () => {
            console.log('Запрашиваю пинг сервера...');
            try {
                const response = await axios.get(`${process.env.HOST}/ping`);
                console.log('Ответ:', response.data);
            } catch (error) {
                console.error('Cron job failed:', error.message);
                console.error('Stack trace:', error.stack);
            }
        });
    }
}
