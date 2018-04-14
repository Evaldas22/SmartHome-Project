var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../db/IoT.db');

db.serialize(function () {

    // Create database
    db.run('CREATE TABLE IF NOT EXISTS things(id INTEGER PRIMARY KEY, name TEXT NOT NULL, group_name TEXT NOT NULL, value TEXT NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

    // Insert into database
    var stmt = db.prepare("INSERT INTO things(name, group_name, value) VALUES (?, ?, ?)");

    for (var i = 0; i < 5; i++) {
        var rooms = ['Kitchen', 'Diningroom', 'Bathroom', 'Bedroom', 'Livingroom'];

        var name = rooms[i];
        var value = "OFF";
        var group_name = "lights";
        stmt.run(name, group_name, value);
    }
    for (var i = 0; i < 3; i++) {
        var sensors = ['Temperature', 'Humidity', 'Door sensor'];

        var name = sensors[i];
        var value = "22";
        var group_name = "sensors";
        stmt.run(name, group_name, value);
    }


    stmt.finalize();

    // Select from database
    db.each("SELECT * FROM things", function (err, row) {
        console.log("id: " + row.id + " name: " + row.name + " value: " + row.value + " group_name: " + row.group_name + " updated_at: " + row.updated_at);
    });

   // db.run('DROP TABLE IF EXISTS things');
   
});

db.close();