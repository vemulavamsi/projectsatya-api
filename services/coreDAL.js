/* Generic methods to get mysql dbConnection and executeQuery */

const { poolConfig } = require("../util/dbConn");
var mysql = require("mysql");

const pool = poolConfig();

class CoreDAL {
  static getConnection() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, dbConn) => {
        if (err) {
          if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Database connection was closed.");
          } else if (err.code === "ER_CON_COUNT_ERROR") {
            console.error("Database has too many connections.");
          } else if (err.code === "ECONNREFUSED") {
            console.error("Database connection was refused.");
          }
          reject(new Error(err));
        } else {
          resolve(dbConn);
        }
      });
    });
  }

  static executeQuery(conn, queryText, args) {
    return new Promise((resolve, reject) => {
      var query = conn.query(queryText, args, (err, result) => {
        console.log(query.sql);
        if (err) {
          console.log("Failed to execute query from core.", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = CoreDAL;

// Copyright (C) 2019, Pycube Aktivu. All rights reserved.
