/*All methods and queries releated login user exist here */
const CoreDAL = require("../services/coreDAL");

class LoginModel {

  static async loginUser(dbConn, loginData) {
    console.log(loginData)
    try {
      const qry = `SELECT * FROM users 
                  WHERE user_name = ? and a_in = 1`;	  
      const args = [loginData.user_name];

      const rawResult = await CoreDAL.executeQuery(
        dbConn,
        qry,
        args
      );	  
      if (rawResult.length > 0) { 
        return rawResult[0];
      } else {
        throw new Error("code:102");
      }
    } catch (error) {
      console.log(error);
      console.log("Error found in LoginDAL.loginUser()");
      throw error;
    }
  }
  //login Admin
  static async loginAdmin(context, loginData) {
    try {
      const qry = "SELECT `login`.*,`users`.* FROM `login`  INNER JOIN `users` on `users`.user_sno = `login`.login_emp_id WHERE login_email = ? and login_user_category = 2 and login_user_status = 1";	  
      const args = [loginData.login_username];

      const rawResult = await CoreDAL.executeQuery(
        context.getDbConn(),
        qry,
        args
      );
	  
      if (rawResult.length > 0) { 
        return rawResult[0];
      } else {
        throw new Error("code:102");
      }
    } catch (error) {       
      throw error;
    }
  }

  //login Driver
  static async loginDriver(context, loginData) {
    try {
      const qry = "SELECT `login`.*,`users`.* FROM `login`  INNER JOIN `users` on `users`.user_sno = `login`.login_emp_id WHERE login_email = ? and login_user_category = 3 and login_user_status = 1";	  
      const args = [loginData.login_username];

      const rawResult = await CoreDAL.executeQuery(
        context.getDbConn(),
        qry,
        args
      );
	  
      if (rawResult.length > 0) { 
        return rawResult[0];
      } else {
        throw new Error("code:102");
      }
    } catch (error) {       
      throw error;
    }
  }
  static async registerUser (context, regData) {
    try {
      const qry = "insert into users (user_name,password,email,first_name) values (?,?,?,?)";	  
      const args = [regData.email , regData.password ,regData.email,regData.user_name];

      const rawResult = await CoreDAL.executeQuery(
        context,
        qry,
        args
      );
	  
      if (rawResult.insertId > 0) { 
        return rawResult;
      } else {
        throw new Error("code:102");
      }
    } catch (error) {       
      throw error;
    }
  }

}

module.exports = LoginModel;

// Copyright (C) 2019, Pycube Aktivu. All rights reserved.
