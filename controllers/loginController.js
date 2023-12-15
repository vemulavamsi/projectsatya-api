/*All business login related to login exist here */
const { getConnection } = require("../services/coreDAL");

//import { getConnection } from "../services/coreDAL";
//import { loginUser as _loginUser, registerUser as _registerUser } from "../models/loginModel";
const { loginUser: _loginUser, registerUser: _registerUser } = require("../models/loginModel");

// const UserDAL = require("../models/userModel");
const { verifyPwd, getHashPwd, createToken, createTemporaryToken, createOtp, formattedDate } =require("../common/general");
// const { formatUserData } = require("../common/formatResultData");
// const { sentOtp, sentTwoFactorAuthOtp } = require("../common/emailConfig");
// const momentFormat = require("../util/moment.utils");
// var jsonDataUtils = require("../util/jsonData.utils");

class LoginController {
  //User Login Method
  static async loginUser(loginData) {
     console.log("Sathya*************Sathya")
    try {
      console.log("Sathya*************Sathya")
      const dbConn = await getConnection();
console.log(dbConn)
      try {

        await dbConn.beginTransaction();
        var data = {
          user_name: loginData.user_name,
          password: loginData.password,
        };
        console.log("*****************",data)
        const userObj = await _loginUser(dbConn,data);
        
        const isValid = await verifyPwd(
          loginData.password,
          userObj.password
        );

        if (isValid) {
          let userData = userObj;

            userData.login_password = "";
            const token = await createToken(userData);
            await dbConn.commit();
            return {
              userData: userData,
              sessionToken: token,
            };
          
        } else {
          throw new Error("code:102");
        }
      } catch (error) {
        dbConn.rollback();
        throw error;
      } finally {
        dbConn.release();
      }
    } catch (error) {
      throw error;
    }
  }
  static async registerUser(regData){
    try {
      const dbConn = await getConnection();

      try {

        await dbConn.beginTransaction();
        var data = {
          user_name: regData.user_name,
          password: await getHashPwd(regData.password),
          mobile: regData.mobile,
          email: regData.email
        };
        console.log("*****************",data)
        const userObj = await _registerUser(dbConn,data);
        
        if(userObj){
          return userObj
        }
        else{
          return 'error 102'
                }
      } catch (error) {
        dbConn.rollback();
        throw error;
      } finally {
        dbConn.release();
      }
    } catch (error) {
      throw error;
    }
  }
}
//const LoginController = require("../controllers/loginController");
module.exports = {LoginController};


