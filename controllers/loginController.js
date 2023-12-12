// /*All business login related to login exist here */

// const CoreDAL = require("../services/coreDAL");
// const LoginDAL = require("../models/loginModel");
// // const UserDAL = require("../models/userModel");
// const {
//   verifyPwd,
//   getHashPwd,
//   createToken,
//   createTemporaryToken,
//   createOtp,
//   formattedDate,
// } = require("../common/general");
// // const { formatUserData } = require("../common/formatResultData");
// // const { sentOtp, sentTwoFactorAuthOtp } = require("../common/emailConfig");
// // const momentFormat = require("../util/moment.utils");
// // var jsonDataUtils = require("../util/jsonData.utils");

// class LoginController {
//   //User Login Method
//   static async loginUser(loginData) {
//     try {
//       const dbConn = await CoreDAL.getConnection();

//       try {

//         await dbConn.beginTransaction();
//         var data = {
//           user_name: loginData.user_name,
//           password: loginData.password,
//         };
//         console.log("*****************",data)
//         const userObj = await LoginDAL.loginUser(dbConn,data);
        
//         const isValid = await verifyPwd(
//           loginData.password,
//           userObj.password
//         );

//         if (isValid) {
//           let userData = userObj;

//             userData.login_password = "";
//             const token = await createToken(userData);
//             await dbConn.commit();
//             return {
//               userData: userData,
//               sessionToken: token,
//             };
          
//         } else {
//           throw new Error("code:102");
//         }
//       } catch (error) {
//         dbConn.rollback();
//         throw error;
//       } finally {
//         dbConn.release();
//       }
//     } catch (error) {
//       throw error;
//     }
//   }
//   static async registerUser(regData){
//     try {
//       const dbConn = await CoreDAL.getConnection();

//       try {

//         await dbConn.beginTransaction();
//         var data = {
//           user_name: regData.user_name,
//           password: await getHashPwd(regData.password),
//           mobile: regData.mobile,
//           email: regData.email
//         };
//         console.log("*****************",data)
//         const userObj = await LoginDAL.registerUser(dbConn,data);
        
//         if(userObj){
//           return userObj
//         }
//         else{
//           return 'error 102'
//                 }
//       } catch (error) {
//         dbConn.rollback();
//         throw error;
//       } finally {
//         dbConn.release();
//       }
//     } catch (error) {
//       throw error;
//     }
//   }
// }
// module.exports = LoginController;
const CoreDAL = require("../services/coreDAL");
const LoginDAL = require("../models/loginModel");
const {
  verifyPwd,
  getHashPwd,
  createToken,
} = require("../common/general");

class LoginController {
  // User Login Method
  static async loginUser(loginData) {
    try {
      const dbConn = await CoreDAL.getConnection();

      try {
        await dbConn.beginTransaction();

        const data = {
          user_name: loginData.user_name,
          password: loginData.password,
        };

        const userObj = await LoginDAL.loginUser(dbConn, data);

        const isValid = await verifyPwd(loginData.password, userObj.password);

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
          throw new Error("Authentication failed");
        }
      } catch (error) {
        dbConn.rollback();
        throw new Error("Error during login: " + error.message);
      } finally {
        dbConn.release();
      }
    } catch (error) {
      throw new Error("Error connecting to database: " + error.message);
    }
  }

  static async registerUser(regData) {
    try {
      const dbConn = await CoreDAL.getConnection();

      try {
        await dbConn.beginTransaction();

        const data = {
          user_name: regData.user_name,
          password: await getHashPwd(regData.password),
          mobile: regData.mobile,
          email: regData.email,
        };

        const userObj = await LoginDAL.registerUser(dbConn, data);

        if (userObj && userObj.success) {
          await dbConn.commit();
          return userObj;
        } else {
          throw new Error("User registration failed");
        }
      } catch (error) {
        dbConn.rollback();
        throw new Error("Error during registration: " + error.message);
      } finally {
        dbConn.release();
      }
    } catch (error) {
      throw new Error("Error connecting to database: " + error.message);
    }
  }
}

module.exports = LoginController;
