var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// var otpGenerator = require("otp-generator");
// var crypto = require("crypto");
// const fs = require("fs-extra");
// var mv = require("mv");
// var moment = require('moment');
// var QRCode = require('qrcode');
// var pdf = require("html-pdf");

// Store hash password in your DB.
exports.getHashPwd = async function (password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    throw error;
  }
};

// Fetching Normal text password from your hash password in DB
exports.verifyPwd = async function (password, hashPwd) {
  try {
    const isValid = await bcrypt.compareSync(password, hashPwd);
    //const passwordValid = bcrypt.compareSync(userData.password,results[0].password)
    return isValid;
  } catch (error) {
    throw error;
  }
};

// Generating Access Token



exports.createToken = async function (userData) {
  try {
    // UserCategory => 1.Customer 2.Pycube
    let roles = [];
    // for(var i = 0; i < userData.user_roles.length; i++){
    //   roles.push(userData.user_roles[i].role_sno);
    // }
    var token = await jwt.sign(
      {
        login_id: userData.login_id,
        login_username: userData.user_fullname,
        hospital: userData.hospital,
        user_category: userData.login_user_category,
        user_sno : userData.user_sno,
        user_type : userData.user_type,
        // user_role:roles,
        time_zone: userData.time_zone ? userData.time_zone : "US/Eastern",
        date_format: userData.date_format ? userData.date_format : "MM/DD/YYYY",

      },
      'PycubeInventoryTracking',
      {
        expiresIn: '10h'
      }
    );
    return token;
  } catch (error) {
    throw error;
  }
};

exports.createTemporaryToken = async function (userData) {
  try {
    var token = await jwt.sign(
      {
        login_id: userData.login_id,
        login_username: userData.login_username,
        hospital: userData.hospital
      },
      'PycubeInventoryTracking',
      {
        expiresIn: '10m'
      }
    );
    return token;
  } catch (error) {
    throw error;
  }
};

// Refreshing Access Token
exports.refeshTokens = async function (currUser, refreshToken) {
  try {
    const { user } = await jwt.verify(refreshToken, process.env.JwtToken1);
    if (currUser.login_id == user.login_id) {
      this.createTokens(currUser.login_id, currUser.login_username);
    } else {
      return {};
    }
  } catch (error) {
    throw error;
  }
};

// Generating a key for user security
exports.createOtp = async function () {
  try {
    const key = await otpGenerator.generate(6, {
      upperCaseAlphabets: false, 
      lowerCaseAlphabets: false, 
      specialChars: false,
      // upperCase: false,
      // specialChars: false,
      digits: true,
      // alphabets: false
    });
    if (key != "") {
      return key;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

exports.createTempPassword = async function () {
  try {
    const key = await otpGenerator.generate(8, {
      digits: true
    });
    if (key != "") {
      return key;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};
// Returns formatted Date
exports.formattedDate = function (mydate = null) {
  var today = new Date();
  if (mydate != null) {
    today = new Date(mydate);
  }

  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  //pull the last two digits of the year
  var yy = yyyy.toString().substr(-2);

  var hs = today.getHours();
  var ms = today.getMinutes();
  var ss = today.getSeconds();

  var ampm = (hs >= 12) ? 'PM' : 'AM';

  var hs12 = hs % 12;
  hs12 = hs12 ? hs12 : 12;

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }
  if (hs < 10) {
    hs = "0" + hs;
  }
  if (ms < 10) {
    ms = "0" + ms;
  }

  if (ss < 10) {
    ss = "0" + ss;
  }

  if (hs12 < 10) {
    hs12 = "0" + hs12;
  }

  time = hs + ":" + ms + ":" + ss;
  today = yyyy + "-" + mm + "-" + dd;
  time_f1 = hs12 + ":" + ms + " " + ampm;
  today_f1 = mm + "-" + dd + "-" + yyyy;
  request = yy + mm + dd;
  fileformat = yyyy + "" + mm + "" + dd + "" + hs + "" + ms + "" + ss;
  year_month = yyyy + "-" + mm;
  today_dispaly = mm + "/" + dd + "/" + yyyy;

  return { 
    date_f1: today_f1, 
    date: today, 
    datetime_f1: today_f1 + " " + time_f1, 
    datetime: today + " " + time, 
    request: request, 
    fileformat: fileformat, 
    time_f1: time_f1, 
    time: time, 
    year_month: year_month,
    date_d : today_dispaly,
    datetime_d : today_dispaly + " " + time
  };
};

exports.formattedEDTDate = function (mydate = null) {
  var today = new Date();
  if (mydate != null) {
    today = new Date(mydate);
  }
  today.setHours(today.getHours() - 4);
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  //pull the last two digits of the year
  var yy = yyyy.toString().substr(-2);

  var hs = today.getHours();
  var ms = today.getMinutes();
  var ss = today.getSeconds();

  var ampm = (hs >= 12) ? 'PM' : 'AM';

  var hs12 = hs % 12;
  hs12 = hs12 ? hs12 : 12;

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }
  if (hs < 10) {
    hs = "0" + hs;
  }
  if (ms < 10) {
    ms = "0" + ms;
  }

  if (ss < 10) {
    ss = "0" + ss;
  }

  if (hs12 < 10) {
    hs12 = "0" + hs12;
  }

  time = hs + ":" + ms + ":" + ss;
  today = yyyy + "-" + mm + "-" + dd;
  time_f1 = hs12 + ":" + ms + " " + ampm;
  today_f1 = mm + "-" + dd + "-" + yyyy;
  request = yy + mm + dd;
  fileformat = yyyy + "" + mm + "" + dd + "" + hs + "" + ms + "" + ss;
  year_month = yyyy + "-" + mm;

  return { date_f1: today_f1, date: today, datetime_f1: today_f1 + " " + time_f1, datetime: today + " " + time, request: request, fileformat: fileformat, time_f1: time_f1, time: time, year_month: year_month };
};

exports.dateRange = async function (startDate, endDate) {
  try {
    console.log("--dateRange Start--");
    var startDate = moment(startDate);
    var endDate = moment(endDate);

    var result = [];

    if (endDate.isBefore(startDate) || startDate.toString() === endDate.toString()) {
      result.push(startDate.format("YYYY-MM-01"));
    }

    while (startDate.isBefore(endDate)) {
      result.push(startDate.format("YYYY-MM-01"));
      startDate.add(1, 'month');
    }
		/*
		if((result.length > 1) && (startDate.toString() === endDate.toString())){
		  result.push(startDate.format("YYYY-MM-01"));
		}
		*/
    return result;
    console.log("--dateRange End--");
  } catch (error) {
    throw error;
  }

}

exports.enumerateDaysBetweenDates = async function (startDate, endDate) {
  try {
    var startDate = moment(startDate);
    var endDate = moment(endDate);
    var now = startDate, dates = [];

    while (now.isSameOrBefore(endDate)) {
      dates.push(now.format('YYYY-MM-DD'));
      now.add(1, 'days');
    }
    return dates;
  } catch (error) {
    throw error;
  }
}

exports.addDaysToDate = async function (mydate = null, mydays = null) {
  try {
    if (mydate == null || mydays == null) {
      throw "Invalid Date";
    }
    let now = moment(mydate);
    now.add(mydays, 'days');
    let format_date = now.format('YYYY-MM-DD');

    return format_date;

  } catch (error) {
    throw error;
  }
}

exports.weeksOfMonth = async function (mydate, myweek) {
  try {
    console.log("--weeksOfMonth Start--");
    var result = [];
    var monday = moment(mydate).startOf('month').day(myweek);
    if (monday.date() > 7) monday.add(7, 'd');
    var month = monday.month();
    while (month === monday.month()) {
      result.push(monday.format("YYYY-MM-DD"));
      //document.body.innerHTML += "<p>"+monday.toString()+"</p>";
      monday.add(7, 'd');
    }
    return result;
    console.log("--weeksOfMonth End--");
  } catch (error) {
    throw error;
  }
}

// Returns formatted Request number
exports.formattedNumber = function (mynumber = null, format = null) {  
  if (mynumber == null || mynumber == '') {
    return format + '0001';
  } else {
    var number = mynumber.replace(format, ''); 
    number = parseInt(number);
    number++;
    if (number < 10 && number > 0) {
      return format + '000' + number;
    } else if (number < 100 && number > 9) {
      return format + '00' + number;
    }else if (number < 1000 && number > 99) {
      return format + '0' + number;
    }  else {
      return format + '' + number;
    }
  }
}

exports.formattedTicketNumber = function (mynumber = null, format = null) {  
  if (mynumber == null || mynumber == '') {
    return format + '0000001';
  } else {
    var number = mynumber.replace(format, ''); 
    number = parseInt(number);
    number++;
    if (number < 10 && number > 0) {
      return format + '000000' + number;
    } else if (number < 100 && number > 9) {
      return format + '00000' + number;
    } else if (number < 1000 && number > 99) {
      return format + '0000' + number;
    } else if (number < 10000 && number > 999) {
      return format + '000' + number;
    } else if (number < 100000 && number > 9999) {
      return format + '00' + number;
    } else if (number < 1000000 && number > 99999) {
      return format + '0' + number;
    } else {
      return format + '' + number;
    }
  }
};


// Encrypt Or Decrypt a key
exports.EDString = function (type, string) {
  if (type != "" && (type == "decrypt" || type == "encrypt") && string != "") {
    var alg = "aes-128-cbc";
    var key = "endecrypt";
    let a = "utf8";
    let b = "hex";

    var mykey = crypto.createCipher(alg, key);

    if (type == "decrypt") {
      a = "hex";
      b = "utf8";
      mykey = crypto.createDecipher(alg, key);
    }

    var mystr = mykey.update(string, a, b);
    mystr += mykey.final(b);

    return mystr;
  } else {
    return null;
  }
};

exports.getCurntReqIp = function (reqAddress) {
  let ip = "";
  if (reqAddress.substr(0, 7) == "::ffff:") {
    ip = reqAddress.substr(7);
  }
  return ip;
};

exports.asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

exports.getDistance = async function (start, end, decimalNumber) {
  let decimals = decimalNumber ? decimalNumber : 6;
  let earthRadius = 6371; // km

  let lat1 = parseFloat(start.latitude);
  let lat2 = parseFloat(end.latitude);
  let lon1 = parseFloat(start.longitude);
  let lon2 = parseFloat(end.longitude);

  let dLat = ((lat2 - lat1) * Math.PI) / 180;
  let dLon = ((lon2 - lon1) * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = earthRadius * c;
  return Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

//generate Random Number

exports.getRandomInteger = async function (numLength = null) {
  let length = 4;
  if (numLength != null) {
    length = numLength;
  }
  return Math.floor(
    Math.pow(10, length - 1) +
    Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
};

//generate EPC Number

exports.getEPCNumber = async function (numLength = null) {
  let length = 4;
  if (numLength != null) {
    length = numLength;
  }
  var text = "";
  //var possible = "ABCDEFGHIJ0123456789";
  var possible = "123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  var timestamp = new Date().getTime();
  return text;
};

exports.uploadFile = async function (tempPath, targetPath, dirPath) {
  try {

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    mv(tempPath, targetPath, function (err) {
      if (err) {
        throw "failed to upload image";
      }
      return true;
    });
  } catch (error) {
    throw error;
  }
};

formatRulesObj = async function (myRulesObj = null) {

  if (myRulesObj == null) {
    return '';
  }

  if (!myRulesObj.value) {
    myRulesObj.value = "''";
  }

  if (myRulesObj.type == 'select') {
    if (myRulesObj.value === "''") {
      myRulesObj.value = [];
    }
  }


  switch (myRulesObj.operator) {
    case "equal":
      myRulesObj.operator = " = ";
      myRulesObj.value = "'" + myRulesObj.value + "'";
      break;
    case "not_equal":
      myRulesObj.operator = " != ";
      myRulesObj.value = "'" + myRulesObj.value + "'";
      break;
    case "contains":
      myRulesObj.operator = " LIKE ";
      myRulesObj.value = "'%" + myRulesObj.value + "%'";
      break;
    case "not_contains":
      myRulesObj.operator = " NOT LIKE ";
      myRulesObj.value = "'%" + myRulesObj.value + "%'";
      break;
    case "begins_with":
      myRulesObj.operator = " LIKE ";
      myRulesObj.value = "'%" + myRulesObj.value;
      break;
    case "not_begins_with":
      myRulesObj.operator = " NOT LIKE ";
      myRulesObj.value = "'%" + myRulesObj.value;
    case "ends_with":
      myRulesObj.operator = " LIKE ";
      myRulesObj.value = "'" + myRulesObj.value + "%'";
      break;
    case "not_ends_with":
      myRulesObj.operator = " NOT LIKE ";
      myRulesObj.value = "'" + myRulesObj.value + "%'";
      break;
    case "is_null":
      myRulesObj.operator = " = ";
      myRulesObj.value = NULL;
      break;
    case "is_not_null":
      myRulesObj.operator = " != ";
      myRulesObj.value = NULL;
      break;
    case "is_empty":
      myRulesObj.operator = " = ";
      myRulesObj.value = "''";
      break;
    case "is_not_empty":
      myRulesObj.operator = " != ";
      myRulesObj.value = "''";
      break;
    case "greater":
      myRulesObj.operator = " > ";
      myRulesObj.value = "'" + myRulesObj.value + "'";
      break;
    case "greater_or_equal":
      myRulesObj.operator = " >= ";
      myRulesObj.value = "'" + myRulesObj.value + "'";
      break;
    case "less":
      myRulesObj.operator = " < ";
      myRulesObj.value = "'" + myRulesObj.value + "'";
      break;
    case "less_or_equal":
      myRulesObj.operator = " <= ";
      myRulesObj.value = "'" + myRulesObj.value + "'";
      break;
    case "in":
      myRulesObj.operator = " IN ";
      myRulesObj.value = "( '" + myRulesObj.value.join("', '") + "' )";
      break;
    case "not_in":
      myRulesObj.operator = " NOT IN ";
      myRulesObj.value = "( " + myRulesObj.value.join(", ") + " )";
      break;
  }

  return myRulesObj;
}

convertToMySqlQuery = async function (myQueryObj = null) {
  var query_condition = '';

  var query_rules = [];

  if (myQueryObj === null) {
    return '';
  }

  if (!myQueryObj.condition || !myQueryObj.rules) {
    return '';
  }

  var rules_len = myQueryObj.rules.length;

  for (var i = 0; i < rules_len; i++) {
    var subQueryObj = myQueryObj.rules[i];

    if (subQueryObj.condition && subQueryObj.rules && subQueryObj.rules.length > 0) {
      let sub_query = await convertToMySqlQuery(subQueryObj);
      if (sub_query !== '') {
        query_rules.push(sub_query);
      }
    } else {

      let rules = await formatRulesObj(subQueryObj);

      query_condition = rules.field + " " + rules.operator + " " + rules.value;
      query_rules.push(query_condition);

    }
  }

  if (query_rules.length > 0) {
    return '(' + query_rules.join(" " + myQueryObj.condition + " ") + ')';
  } else {
    return '';
  }

}
exports.convertToQuery = async function (myQueryObj = null) {
  try {

    if (myQueryObj === null) {
      return '';
    }

    if (!myQueryObj.condition || !myQueryObj.rules) {
      return '';
    }

    const query = await convertToMySqlQuery(myQueryObj);

    return query;
  } catch (error) {
    throw error;
  }
}

exports.getCallerIP = async function (request = null) {
  var ip = request.headers['x-forwarded-for'] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress;
  ip = ip.split(',')[0];
  ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
  return ip;
}

// Generate QRCode Image data
exports.generateQRCode = async function (data) {
  try {
    const qr_image = await QRCode.toDataURL(data);
    if (qr_image != "") {
      return qr_image;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};


exports.generatePDF = async function (content, options, filename) {
  try {

    return new Promise((resolve, reject) => {
      pdf.create(content, options).toFile(filename, function (err, data) {
        if (err) {
          console.log(err);
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
    //
  } catch (error) {
    throw error;
  }
};


exports.formattedQRData = async function (qr_data = null) {
  try {
    if (qr_data == null || qr_data == '') {
      throw "Invalid data";
    } else {
      const res = qr_data.split("-");
      if (res.length == 3) {
        return { "request_id": res[0] + "-" + res[1], "box_number": res[2] };
      } else if (res.length == 2) {
        return { "request_id": res[0] + "-" + res[1], "box_number": 0 };
      } else {
        throw "Invalid data";
      }
    }
  } catch (error) {
    throw error;
  }
}

mysql_real_escape_string = async function(str) {
  if (typeof str != 'string')
    return str;

    str = str.trim();  

  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
    }
  });
}

formatParams = async function (myParams = null) {
  const keys = Object.keys(myParams);
  
  for(var i = 0; i < keys.length; i++){
    // console.log("HHHHHHHHHHHHHHHHHHHHHH",keys[i],myParams[keys[i]]);
    if(typeof myParams[keys[i]] === "object"){
      myParams[keys[i]] = await formatParams(myParams[keys[i]]);
      
    } else {
      //console.log(typeof myParams[keys[i]] + " => "+myParams[keys[i]]);
      //myParams[keys[i]] = await mysql_real_escape_string(myParams[keys[i]]);
      if(typeof myParams[keys[i]] === "string"){
        myParams[keys[i]] = (myParams[keys[i]]).trim();
      }
      
    }    
  }  
  return myParams;
}

exports.formatRequestParams = async function (myParams = null) {
  try {
    
    if (myParams === null) {
      return myParams;
    }    

    if(typeof myParams !== "object"){
      return myParams;
    }
    
    const reqParams = await formatParams(myParams);

    return reqParams;
  } catch (error) {
    throw error;
  }
}

exports.getNextMaintenanceDate = async function(mydate, mymonths, including_today = true){
  
  if(parseInt(mymonths) == 0 || parseInt(mymonths) == NaN){
    return '';
  }
  if (mydate == null) {
    return '';
  }
  var mydate_m = moment(mydate);
  if(including_today){
    var today = moment();
  }else{
    var today = moment().add(1, 'days');
  } 
  
  do{
    mydate_m.add(mymonths, 'months');
    // console.log(mydate_m);
  }while(mydate_m.diff(today, 'days') < 0)

  return mydate_m.format('YYYY-MM-DD');
};



// Copyright (C) 2019, Pycube Aktivu. All rights reserved.