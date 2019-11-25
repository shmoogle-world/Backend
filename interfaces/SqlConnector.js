const mysql = require('mysql');

class Connector {

    static _connect() {
        return mysql.createConnection({
            host: process.env.APPSETTING_MYSQL_HOST,
            user: process.env.APPSETTING_MYSQL_USER,
            password: process.env.APPSETTING_MYSQL_PASSWORD,
            database: process.env.APPSETTING_MYSQL_DB
        });
    };

    static async query(sql, args) {
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