//practice websockets
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const mysql = require("mysql");
const MySQLEvents = require("@rodrigogs/mysql-events");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

//app will be the function handler - routing, rendering, etc. for the http server

app.set("view engine", "ejs");

app.get("/home", (req, res) => {
  res.render("home");
});

//socket.io logic

//Initialize an instance of socket.io by passing server
//here, we will listen to the incoming sockets to the server
io.on("connection", async (socket) => {
  //here is the only place where we have access to the current
  //connected socket

  console.log("a user connected" + socket.id);
  socket.emit("connection", "I have connected");

  //establish database connection
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sql783knui1-1l;/klaa-9",
    database: "nodemysql",
  });

  //error handler to see if the database connection was made successfully
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL database:", err);
      return;
    }
    console.log("Connected to MySQL database");
  });

  // const sql = "select * from `posts` order by `id` desc"
    const sql = "select * from `people` order by `id` desc"

  connection.query(sql,(err,result)=>{
    if(err) throw err;
    // console.log(result);
  socket.emit("connection",result)

  })

  //emit all existing data to the client side


  //create instance for mysqlevents - or event listener
  const instance = new MySQLEvents(connection, {
    startAtEnd: true,
  });

  //start listening to mysql database asynchronously
  await instance.start();

  //add trigger for which statement we want to listen
  instance.addTrigger({
    name: "monitoring",
    expression: "*",
    statement: MySQLEvents.STATEMENTS.INSERT,
    onEvent: (event) => {
      // You will receive the events here
      console.log(event);
      console.log(event.affectedRows.length);
      console.log(event.affectedRows);
      socket.emit("showNewData", event.affectedRows)
      //emit the latest added rows to client side
      //here, we will read sql
    },
  });

});

server.listen(3001, () => {
  console.log("Server running");
});


