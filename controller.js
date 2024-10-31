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
        const drankWater = req.body.drankWater;
        const idTelegram = req.body.idTelegram;
        const newUser = await db.query('INSERT INTO users_bot (name, height, weight, drankWater, active, id_telegram) VALUES ($1, $2, $3, $4, true, $5) RETURNING *', [name, height, weight, drankWater, idTelegram]);
        if (newUser) {
            res.send('add');
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
            const updateWater = await db.query('UPDATE users_bot SET drankWater = drankWater + $1 WHERE id_telegram = $2 RETURNING *', [water, id]);
            if (updateWater) {
                res.send('update water');
            }
            else {
                console.error('Не смогли обновить данные о выпитой воде');
            }
        }
        else {
            const idTelegram = req.body.idTelegram;
            const getUser = await db.query('SELECT * from users_bot WHERE id_telegram = $1', [idTelegram]);
            if (getUser) {
                if (getUser.active !== true) {
                    const updateActivity = await db.query('UPDATE users_bot SET active = false WHERE id_telegram = $1  RETURNING *', [idTelegram]);
                    if (updateActivity) {
                        res.send('update active');
                    }
                    else {
                        console.error('Не смогли обновить статус активности');
                    }
                }
                else {
                    const updateActivity = await db.query('UPDATE users_bot SET active = true WHERE id_telegram = $1 RETURNING *', [idTelegram]);
                    if (updateActivity) {
                        res.send('update active');
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
