var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var path = require('path')


// database directory
var databaseDir = process.cwd() + '/public/db/IoT.db';
// Open database
var db = new sqlite3.Database(databaseDir);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('i2', { title: 'SmartHome Bachelor' });
});


/* GET groups. */
router.get('/groups', function (req, res, next) {
  db.serialize(function () {
    db.each("SELECT DISTINCT group_name FROM things", function (err, row) {
      item = {}
      item["group_name"] = row.group_name;
      jsonObj.push(item);
      //console.log("id: " + row.id + " name: " + row.name + " state: " + row.state + " created_at: " + row.created_at);
    },
      function (err, rows) {
        res.json(jsonObj);
        jsonObj = [];
      });
  });
});

/* POST new. */
router.post('/addNew', function (req, res, next) {
  var name = req.body.name;
  var value = req.body.value;
  var group_name = req.body.group_name;

    if(name && group_name){
      db.run("INSERT into things(name, group_name, value) VALUES ('"+name+"','"+group_name+"', '"+value+"')");
      res.send("Inserted thing with name: " + name + ' with group_name: ' + group_name) + ' value: ' + value;
    }
    else 
     res.send("Name or group not givenn");

});

/* POST new. */
router.post('/delete', function (req, res, next) {
  var id = req.body.id;

    if(id){
      db.run("DELETE from things where id ='" + id +"'");
      res.send("Deleted row with id: " + id);
    }
    else 
     res.send("id not given");
     
});

module.exports = router;