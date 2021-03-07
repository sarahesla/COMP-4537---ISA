const mysql = require("mysql");
const http = require("http");
const Stonk = require("./stonk.js");
const path = require("path");
const appDir = path.join(path.dirname(require.main.filename), "/");

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "isa-quiz"
});

let stonk = new Stonk();
stonk.files(appDir);

// routes
stonk.get("/questions", (req, res) => {
  try {
    let query = "SELECT now()";
    dbConnection.query(query, function(err, result, fields) {
      stonk.json(JSON.stringify(result), 200);
    });
  }

  catch(e) {
    stonk.html("400", 400);
  }
});

dbConnection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//rip the stonk
stonk.rip(8080, () => {
  console.log("Stonk has been ripped.");
})
