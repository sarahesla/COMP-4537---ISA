const mysql = require("mysql");
const http = require("http");
const Stonk = require("./stonk.js");
const path = require("path");
const appDir = path.join(path.dirname(require.main.filename), "/");

const dbConnection = mysql.createConnection({
  host: "s11.fcomet.com",
  user: "sarahesl_admin",
  password: "thisisapassword",
  database: "sarahesl_isa-quiz"
});

let stonk = new Stonk();

// routes
stonk.get("/", (req, res) => {
  console.log(appDir);
  stonk.serveFile(res, "./Frontend/index.html");
})

stonk.get("/questions", (req, res) => {
  try {
    let query = "SELECT * FROM questions JOIN options ON questions.id = options.questionID";
    dbConnection.query(query, function(err, result, fields) {
      console.log(result);
      stonk.json(JSON.stringify(result), 200);
    });
  }

  catch(e) {
    stonk.html("400", 400);
  }
});

stonk.post("/addQuestion", (req, res) => {
  try {
    let data = stonk.data;
    console.log(data);
    let addQuestion = "INSERT INTO questions (id, question) VALUES ('"+data.id+"', '"+data.question+"')";
    dbConnection.query(addQuestion, function(err, result, fields) {
      let addOptions = "INSERT INTO options (questionID, answer, isCorrect) VALUES ?";
      let values = []
      let {id, options, isCorrect} = data
      for(let i = 0; i < 2; i++){
          let f = []
          f.push(id)
          f.push(options[i])
          f.push(isCorrect[i])
          values.push(f)
      }
      console.log(values)
      dbConnection.query(addOptions, [values], function(err,  result){
          if (err) throw 'err2';
          console.log("record"+ JSON.stringify(result))
      })
      stonk.json(JSON.stringify(result), 200);
    });
  }

  catch(e) {
    stonk.html("400", 400);
  }
})

dbConnection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//rip the stonk
stonk.rip(8080, () => {
  console.log("Stonk has been ripped.");
})
