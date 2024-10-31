const axios = require("axios");

const getUsers = async (users) => {
    const response = await axios.get(`${process.env.HOST}/users`);
    users.push(response.data);
    console.log(`Количество найденных пользователей: ${users.length}`);
}

module.exports = {
    getUsers
}
