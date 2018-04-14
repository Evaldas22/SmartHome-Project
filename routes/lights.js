var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var path = require('path')

// database directory
var databaseDir = process.cwd() + '/public/db/IoT.db';
// Open database
var db = new sqlite3.Database(databaseDir);

// lights to json object from db 
global.jsonObj = [];

/* GET lights listing. */
router.get('/', function (req, res, next) {
  db.serialize(function () {
    db.each("SELECT * FROM things WHERE group_name='lights'", function (err, row) {
      item = {}
      item["id"] = row.id;
      item["name"] = row.name;
      item["value"] = row.value;
      item["group_name"] = row.group_name;
      item["updated_at"] = row.updated_at;

      jsonObj.push(item);
      //console.log("id: " + row.id + " name: " + row.name + " state: " + row.state + " created_at: " + row.created_at);
    },
      function (err, rows) {
        res.json(jsonObj);
        jsonObj = [];
      });
  });
});

/* GET light with id. */
router.get('/:id', function (req, res, next) {

  db.all("SELECT * FROM things WHERE id=" + req.params.id, function (err, row) {
    res.send(row);
  });

});

// Update with params
router.post('/update', function (req, res) {
  var upd_id = req.body.id;
  var name = req.body.name;
  db.serialize(function () {
    db.each("SELECT name, value FROM things WHERE id=" + upd_id, function (err, row) {
      var state = "";
      if (row.value === "OFF")
        state = "ON";
      else
        state = "OFF";

      db.run("UPDATE things SET value = '" + state + "', updated_at = datetime('now','localtime') WHERE id = " + upd_id);
      res.send("Light state was updated: id: " + upd_id + " Room: " + row.name + " State: " + state);

    }, function (err, rows) {
      // COMPLETE
    });
  });
});

// Update with id
router.post('/update/:id', function (req, res) {
  var upd_id = req.params.id;
  var name = req.body.name;
  var group_name = req.body.group_name;

  db.serialize(function () {
    db.each("SELECT name, group_name FROM things WHERE id=" + upd_id, function (err, row) {
      if ((name !== row.name || group_name !== row.group_name) && (name || group_name)) {

        var updtStr = "UPDATE things SET ";

        if (name && group_name)
          updtStr += "name = '" + name + "', group_name = '" + group_name + "', ";
        else if (name)
          updtStr += "name = '" + name + "', ";
        else if (group_name)
          updtStr += "group_name = '" + group_name + "', ";

        //res.send("ANSWER: " + updtStr);
        db.run(updtStr + "updated_at = datetime('now','localtime') WHERE id = " + upd_id);
        res.send("Updated: id: " + upd_id + " Room_name: " + name + " Group_name: " + group_name);
      }
      else {
        res.send("No name or group_name was givenn");
      }

    }, function (err, rows) {
      // COMPLETE
    });
  });
  //res.send("TEXT : " + upd_id + name + group);
});

module.exports = router;