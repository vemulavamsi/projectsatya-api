var express = require('express');
var router = express.Router();
var passport  = require('passport');
var LoginController = require("../controllers/loginController");



router.get('/',function(req,res,next){
        res.render('login',{});
});


//Router for user login
router.post("/", async (req, res) => {
    try {
      var loginData = req.body;
  
      let result = {};
      const obj = await LoginController.loginUser(
        loginData
      );
      result.success = true;
        result.accesstoken = obj.sessionToken;
        result.userData = obj.userData;
      
  
      /** Auditlog Start */
      global.LoginId = obj.userData.user_id;
      global.CreatedName = obj.userData.user_name;
      /** Auditlog End */
  
      res.send(result);
  
    } catch (error) {
      console.log(error)
      res.send(`login controller error`);
    }
  });


module.exports = router;