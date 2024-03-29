const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3003;
const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/picngo";

//middleware
const whitelist = [
  "http://localhost:3000",
  "http://localhost:3003",
  "https://pic-n-go.herokuapp.com",
  "http://pic-n-go.herokuapp.com",
  "https://api.unsplash.com/",
  "https://shiny-rugelach-94ba83.netlify.app"
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) != -1 || origin == undefined) {
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));



app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// mongodb database connection
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
mongoose.connection.on("error", (err) =>
  console.log(err.message + " is Mongod not running?")
);
mongoose.connection.on("disconnected", () => console.log("mongoose disconnected"));
mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});

// controllers, routers
const usersController = require("./controllers/users.js");
app.use("/users", usersController);

// const picksController = require("./controllers/picks.js");
// app.use("/picks", picksController);

//Trying to get the home page to render once user logs out
app.get('/users', (req, res) => {
  res.render('/home', {
    loggedIn: false
  })
})

//Trying to render the home page on initial load
app.get("/", (req, res) => {
  res.render("/users");
});

app.listen(PORT, () => {
  console.log("listening on PORT: ", PORT);
});

console.log("MongoDB Port: ", DATABASE_URL)
