var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database : 'vamsi_project'
});

db.connect(function(err){
    if(err) throw err;
    console.log("Database Connected.");
});

module.exports = db;