const mysql = require('mysql');

class Connector {

    constructor() {
        this.connector = Connector._connect();
    }

    static _connect() {
        return mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        });
    };

    async query(sql, args) {
        let con = Connector._connect();

        return new Promise((resolve, reject) => {
            /* Connect to the database */
            con.query(sql, args, (err, rows) => {
                con.destroy();
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
};

module.exports = Connector;