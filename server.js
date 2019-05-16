// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// table(DATA)
// =============================================================
class Table {
  constructor(name, email, phone, tableNumber) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.isWaiting = false;
    this.tableNumber = tableNumber;
  }
}

var tables = [];
var waitingList = [];
var isFreeTable = [true, true, true, true, true];
const TOTAL_TABLES = 5;

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/reserve", function (req, res) {
  res.sendFile(path.join(__dirname, "makeReservation.html"));
});

app.get("/tables", function (req, res) {
  res.sendFile(path.join(__dirname, "viewTables.html"));
});

app.get("/clear", function (req, res) {
  res.sendFile(path.join(__dirname, "clear.html"));
});

app.get("/api/tables", function (req, res) {
  return res.json(tables);
});

app.get("/api/waitlist", function (req, res) {
  return res.json(waitingList);
});

app.post("/api/clear", function (req, res) {
  console.log(req.body);
  var tableNum = req.body;
  freeUpTable(tableNum.number);
  res.json("Table " + tableNum.number + " cleared.");
});

function freeUpTable(number) {
  isFreeTable[number] = true;

  for (var i = 0; i < tables.length; i++) {
    if (tables[i].tableNumber === +number) {
      tables.splice(i, 1);
    }
  }
}


app.post("/api/makeReservation", function (req, res) {
  var newTable = req.body;
  var tableNumber = getFreeTable();
  var table = new Table(newTable.name, newTable.email, newTable.phone, tableNumber);

  console.log(JSON.stringify(table));

  if (getFreeTable != 0) {
    table.index = tables.push(table);
  } else {
    table.index = waitingList.push(table);
  }
  res.json(table);
});

function getFreeTable() {
  for (var i = 0; i < TOTAL_TABLES; i++) {
    if (isFreeTable[i]) {
      isFreeTable[i] = false;
      return i + 1;
    }
  }
  return 0;
}

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
