const pg = require('pg');
require('dotenv').config();

const db = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
});

module.exports = db;
