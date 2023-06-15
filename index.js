// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const isUnix = (number) => {
  return /^\d+$/.test(number);
};

const invalidDate = (date) => {
  let dateTest = new Date(date);
  if (isUnix(date) === true) {
    return 1;
  } else if (dateTest instanceof Date && !isNaN(dateTest)){
    return 2;
  } else {
    return 0;
  }
};

app.get("/api", function(req, res, next) {
  res.utc = new Date().toUTCString();
  res.unix = parseInt((new Date(res.utc).getTime()));
  next();
}, (req, res) => {
  res.json({
    unix: parseInt(res.unix),
    utc: res.utc.toString(),
  });
})

app.get(
  "/api/:date",
  function (req, res, next) {
    if (!req.params.date) {
      res.badInput = true;
      res.utc = new Date().toUTCString();
      res.unix = parseInt((new Date(res.utc).getTime()));
    } else {
      res.noDate = false;
    const isDate = invalidDate(req.params.date);
    if (isDate === 0) {
      console.error("bad date format");
      res.badInput = true;
    } else if (isDate === 1) {
      res.badInput = false;
      res.unix = parseInt(req.params.date);
      res.utc = new Date(res.unix).toUTCString();
    } else {
      res.badInput = false;
      res.utc = new Date(req.params.date).toUTCString();
      res.unix = parseInt((new Date(req.params.date).getTime() ));
    }
  }
    next();
  },
  (req, res) => {
    if (res.badInput === false) {
      res.json({
        unix: parseInt(res.unix),
        utc: res.utc.toString(),
      });
    } else {
      res.json({
        error: "Invalid Date"
      });
    }
  }
);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
