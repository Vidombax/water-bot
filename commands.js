const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'users.json');

function readJsonFile() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return null;
    }
}

function writeJsonFile(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Пользователь был обновлен: ${data}`);
    } catch (error) {
        console.error('Error writing JSON file:', error);
    }
}

function addUser(newUser) {
    const data = readJsonFile();
    if (data.users.length > 0) {
        data.users.push(newUser);
        writeJsonFile(data);
        console.log(`Пользователь был добавлен: ${data.users}`);
    }
    else {
        data.users.push(newUser);
        writeJsonFile(data);
    }
}

module.exports = {
    addUser,
    readJsonFile,
    writeJsonFile
}
