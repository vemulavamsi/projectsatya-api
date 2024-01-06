var mysql = require('mysql');
var db = mysql.createConnection({
    host: '172.31.82.254',
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
