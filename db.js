//var mysql = require('mysql');
var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'mysql-container',
    user: 'root',
    password: 'Pycube123$',
    port: 3306,
    database : 'vamsi_project'
});

db.connect(function(err){
    if(err) throw err;
    console.log("Database Connected.");
});

module.exports = db;
