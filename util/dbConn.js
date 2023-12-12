var mysql = require('mysql');

exports.poolConfig = function() {
    var pool = mysql.createPool({
        connectionLimit: 150,
        // host: localhost,
        // user: process.env.DB_USER,
        // database:process.env.DB_SCHEMA_NAME,
        host: 'localhost',
        user: 'root',
        password: 'Pycube123$',
        port: 3306,
        database : 'vamsi_project'
        // password:process.env.DB_PASSWORD,
        // password:'',
    });

    return pool;   
}
