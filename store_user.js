const axios = require("axios");

const getUsers = async () => {
    try {
        const response = await axios.get(`${process.env.HOST}/users`);
        console.log(`Количество найденных пользователей: ${response.data.length}`);
        return response.data;
    }
    catch (e) {
        console.error(e);
    }
}

const updateActivity = async (idTelegram, isStartCommand) => {
    try {
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
    catch (e) {
        console.error(e);
    }
}

const updateWaterData = async (idTelegram, userCup) => {
    try {
        const response = await axios.put(`${process.env.HOST}/user`, {
            "isWaterAdding": true,
            "idTelegram": idTelegram,
            "userCup": userCup
        });
        return console.log(response.data);
    }
    catch (e) {
        console.error(e);
    }
}

const addUser = async (newUser) => {
    try {
        const response = await axios.post(`${process.env.HOST}/user`, {
           "name": newUser.name,
           "height": newUser.height,
           "weight": newUser.weight,
           "drankWater": newUser.drankWater,
           "idTelegram": newUser.idTelegram,
        });
        return console.log(response.data);
    }
    catch (e) {
        console.error(e);
    }
}

module.exports = {
    getUsers,
    updateActivity,
    addUser,
    updateWaterData
}
