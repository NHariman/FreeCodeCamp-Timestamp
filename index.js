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
  let dateObject = {
    year: 0,
    month: 0,
    day: 0,
  };
  if (isUnix(date) === true) {
    return 1;
  }
  console.log(date);
  for (const char of date) {
    console.log(char);
    if (char !== "-") {
      if (!char.match(/[0-9]/i)) {
        return 0;
      } else {
        if (dateObject.year < 4) {
          dateObject.year += 1;
        } else if (dateObject.month < 2) {
          dateObject.month += 1;
        } else if (dateObject.day < 2) {
          dateObject.day += 1;
        }
      }
    }
  }
  console.log(dateObject);
  if (dateObject.year === 4 && dateObject.month === 2 && dateObject.day === 2) {
    return 2;
  } else {
    return 0;
  }
};

app.get(
  "/api/:date",
  function (req, res, next) {
    const isDate = invalidDate(req.params.date);
    if (isDate === 0) {
      console.error("bad date format");
      res.badInput = true;
    } else if (isDate === 1) {
      res.badInput = false;
      console.log("unix time: req.params.date: " + req.params.date);
      res.unix = parseInt(req.params.date);
      res.utc = new Date(res.unix);
    } else {
      res.badInput = false;
      let parts = req.params.date.split("-");
      console.log("parts: ", parts);
      res.utc = new Date(parts[0], parts[1], parts[2]);
      console.log("res.utc: " + res.utc);
      res.unix = parseInt((res.utc.getTime() / 1000).toFixed(0));
    }
    next();
  },
  (req, res) => {
    if (res.badInput === false) {
      res.json({
        unix: parseInt(res.unix),
        utc: res.utc,
      });
    } else {
      res.send("Bad date format");
    }
  }
);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
