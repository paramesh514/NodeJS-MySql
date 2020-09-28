const path  = require('path');
require('dotenv').config({path: '.env'});
const rules = require('./Rules')
var mysql = require('mysql');

// Set some defaults
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.PWD);

var con = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USR,
  password: process.env.DB_PWD
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

function getAll() {
  //return db.get('value').value();
}
//console.log(db.get('value.hi').value());
function setValue(key, data) {
  key = key.toLowerCase();
  key = key.replace('/', '.');
  //str_data = ''+data;
  //prev = db.get('value.' + key).value();
  if ((typeof prev != "undefined") && (prev == data)) {
    return 0;
  } else {
    //    console.log(''+data);
    //db.set('value.' + key, '' + data).write();
    //timestamp('value.' + key);
    //sync(key);
    rules.process({
      getAll: getAll,
      setValue: setValue,
      getValue: getValue,
      setSecure: setSecure,
      getSecure: getSecure,
    }, key, data);
    return 1;
  }
}
function getValue(key) {
  key = key.replace('/', '.');
  key = key.toLowerCase();
  //return db.get('value.' + key).value();
}



function getValueS(key) {
  key = key.replace('/', '.');
  key = key.toLowerCase();
  //return db.get('secure.' + key).value();
}

function setValueS(key, data) {
  key = key.toLowerCase();
  key = key.replace('/', '.');
  //str_data = ''+data;
  //prev = db.get('secure.' + key).value();
  if ((typeof prev != "undefined") && (prev == data)) {
    return 0;
  } else {
    //    console.log(''+data);
    //db.set('secure.' + key, '' + data).write();
    timestamp('secure.' + key);
    sync(key);
    rules.process({
      getAll: getAll,
      setValue: setValue,
      getValue: getValue,
      setSecure: setSecure,
      getSecure: getSecure,
      runCommand: runCommand,
      runAction: runAction,
      runGCommand: runGCommand,
      notify: notify,
    }, key, data);
    return 1;
  }
}
function setSecure(key, data) {

  return setValueS(key, cryptr.encrypt(data));
}

function getSecure(key) {
  text = getValueS(key);
  if (typeof text != "undefined" && text != null)
    return cryptr.decrypt(getValueS(key));
  else
    return text;

}




module.exports = {
  getAll: getAll,
  setValue: setValue,
  getValue: getValue,
  setSecure: setSecure,
  getSecure: getSecure,
};

