var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var path = require('path')

// database directory
var databaseDir = process.cwd() + '/public/db/IoT.db';
var db = new sqlite3.Database(databaseDir);

// lights to json object from db 
global.jsonObj = [];

/* GET lights listing. */
router.get('/', function (req, res, next) {
  db.each("SELECT * FROM things WHERE group_name='sensors'", function (err, row) {
    if(!row) return;
    item = {}
    item["id"] = row.id;
    item["name"] = row.name;
    item["value"] = row.value;
    item["group_name"] = row.group_name;
    item["updated_at"] = row.updated_at;
  
    jsonObj.push(item);
    //console.log("id: " + row.id + " name: " + row.name + " state: " + row.state + " created_at: " + row.created_at);
  }, 
  function(err, rows) {
    res.json(jsonObj);
    jsonObj = [];
  });
  
});

/* GET sensor with id. */
router.get('/:id', function (req, res, next) {
  db.all("SELECT * FROM things WHERE id=" + req.params.id, function (err, row) {
    res.send(row);
  });

});

router.post('/update', function (req, res) {
  var upd_id = req.body.id;
  var name = req.body.name;

  db.each("SELECT name, value FROM things WHERE id=" + upd_id, function (err, row) {
    var state = "";
    if (row.value === "OFF")
      state = "ON";
    else
      state = "OFF";
    
    db.run("UPDATE things SET value = '"+ state +"', updated_at = datetime('now','localtime') WHERE id = " + upd_id);
    res.send("Light state was updated: id: "+ upd_id + " Room: " + row.name + " State: " + state);

  }, 
  function(err, rows) {
    // COMPLETE
  });

});

module.exports = router;
