require("dotenv").config();
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const bodyparser = require("body-parser");
const cors = require("cors")
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const {responseHandler} = require("./utils/handler/responseHandler")
const { ErrorHandler } = require("./utils/handler/errorHandler");
const timer = require("./Games/timers");
const path = require("path");
const { databaseConnection } = require("./database/connection");
const flash = require('connect-flash');
const cookieParser = require("cookie-parser");
const betController =  require("./Games/betcontroller");
// const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(flash());
// app.use(function (req , res ,next ) {
//     res.locals.message = req.flash();
//     next();
// });
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/assets/")));

const NAMESPACE = process.env.WS_BASE_PATH || "";
const hostname = "127.0.0.1";
const port = 3000;

const io = new Server(server, { path: "", cors: { origin: "*" } });
global.io = io.of(NAMESPACE);

// timer.StartTimer(1000);
timer.StartTimer(1000)

io.of(NAMESPACE).on("connection", async (socket) => {
  console.log("Connection on - ", socket.id);
  timer.RegisterSocket(socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Socket Disconnected ", socket.id);
    timer.StopTimer(socket.id);
  });

  timer.SendTimerEventEverySecond(socket,1000);

  socket.on("REQ_BET", async (data) => {
    let betData = 
    {
      socketId : socket.id,
      betAmount : data.betAmount,
      betNumbers : data.numbers
    }
    betController.AddBet(data.roundType,betData);
  });
});

// ------------------------ GLOBAL MIDDLE WARES -------------------------
app.use(bodyparser.json());
app.use(cookieParser());
app.use(cors());

// ------------------------    RESPONSE HANDLER    -------------------
app.use((req, res, next) => {
  res.handler = responseHandler;
  next();
});

// ------------------------    Error HANDLER    -------------------
app.use((req, res, next) => {
  res.errorHandler = ErrorHandler;
  next();
});

// ------------------------- DATABSE CONNECTION  ------------------------------
databaseConnection();

//Importing Routes
app.use("/", require("./routes/admin/admin"));
app.use("/", require("./routes/user/user"));

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
