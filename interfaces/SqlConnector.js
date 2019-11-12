const mysql = require('mysql');

class Connector {

    constructor(){
        this.connector = this._connect();
    }

    _connect(){
        return mysql.createConnection({
            host: "",
            user: "",
            passowrd: "",
            database: ""
        });
    };

    query(query){
        this.connector.connect(function(err){
            if(err) throw err;
        });

        this.connector.query(query,function(err, result){
            if(err) throw err;

            this.connector.end();
            return result;
        });
    };
}


