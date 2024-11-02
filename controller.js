const db = require('./db.js');

class Controller {
    static async ping(req, res) {
        res.send('pong');
    }
    static async getUsers(req, res) {
        const users = await db.query('SELECT * FROM users_bot');
        res.json(users.rows);
    }
    static async addUser(req, res) {
        const name = req.body.name;
        const height = req.body.height;
        const weight = req.body.weight;
        const idTelegram = req.body.idTelegram;
        const newUser = await db.query('INSERT INTO users_bot (name, height, weight, drank_water, active, id_telegram) VALUES ($1, $2, $3, 0, true, $4) RETURNING *', [name, height, weight, idTelegram]);
        if (newUser) {
            res.send(`Добавлен пользователь id: ${newUser.rows[0].id}`);
        }
        else {
            console.error('Пользователь не был добавлен');
        }
    }
    static async updateUser(req, res) {
        const isWaterAdding = req.body.isWaterAdding;
        if (isWaterAdding === true) {
            const id = req.body.idTelegram;
            const water = req.body.userCup;
            const updateWater = await db.query('UPDATE users_bot SET drank_water = drank_water + $1 WHERE id_telegram = $2 RETURNING *', [water, id]);
            if (updateWater) {
                res.send(`Обновлены данные по количеству выпитой воды`);
            }
            else {
                console.error('Не смогли обновить данные о выпитой воде');
            }
        }
        else {
            const idTelegram = req.body.idTelegram;
            const isStartCommand = req.body.isStartCommand;
            const getUser = await db.query('SELECT * from users_bot WHERE id_telegram = $1', [idTelegram]);
            if (getUser) {
                if (isStartCommand !== false) {
                    const updateActivity = await db.query('UPDATE users_bot SET active = true WHERE id_telegram = $1 RETURNING *', [idTelegram]);
                    if (updateActivity) {
                        res.send(`update active to true from id: ${updateActivity.rows[0].id}`);
                    }
                    else {
                        console.error('Не смогли обновить статус активности');
                    }
                }
                else {
                    const updateActivity = await db.query('UPDATE users_bot SET active = false WHERE id_telegram = $1 RETURNING *', [idTelegram]);
                    if (updateActivity) {
                        res.send(`update active to false from id: ${updateActivity.rows[0].id}`);
                    }
                    else {
                        console.error('Не смогли обновить статус активности');
                    }
                }
            }
            else {
                res.send('not found user');
            }
        }
    }
}

module.exports = Controller;
