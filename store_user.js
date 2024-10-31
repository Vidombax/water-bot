const axios = require("axios");

const getUsers = async () => {
    const response = await axios.get(`${process.env.HOST}/users`);
    console.log(`Количество найденных пользователей: ${response.data.length}`);
    return response.data;
}

const updateActivity = async (idTelegram, isStartCommand) => {
    if (isStartCommand === true) {
        const response = await axios.put(`${process.env.HOST}/user`, {
            "isWaterAdding": false,
            "idTelegram": idTelegram,
            "isStartCommand": true
        });
        return console.log(response.data);
    }
    else {
        const response = await axios.put(`${process.env.HOST}/user`, {
            "isWaterAdding": false,
            "idTelegram": idTelegram,
            "isStartCommand": false
        });
        return console.log(response.data);
    }
}

module.exports = {
    getUsers,
    updateActivity
}
