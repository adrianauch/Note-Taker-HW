// require in node modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const { randomUUID } = require("crypto");

// section for PORT (boiler plate using Heroku)
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// create promose object to read file
const readFromFile = util.promisify(fs.readFile);

// function to write data to json file
// destination is wthe file you want to write to
// content is what you want to put in teh file
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 2), (err) =>
    err ? console.log(err) : console.info(`\n Data written to ${destinatiom}`)
  );

// function to read data and append content
// content = what you want to append to the file
// file the path to the file you want to save

const readnwrite = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.info(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET route to return notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// GET route return index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// GET to return the api/notes file
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} requested received for notes`);
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST
// format on db.json
// [
//     {
//         "title":"Test Title",
//         "text":"Test text"
//     }
// ]

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request recieved to add a note`);
  // destructure object to pull out info we need
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      note_id: randomUUID(),
    };
    readnwrite(newNote, "./db/db.json");
    res.json("Your note as been added");
  } else {
    res.error("an error had occurred");
  }
});

// Listen
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}🚀`);
});
