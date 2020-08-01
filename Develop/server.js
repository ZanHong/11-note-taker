// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// make public available to front end
app.use(express.static("public"));

// Reads current notes in JSON format
var currentNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

// Routes
// =============================================================
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});

app.get("/api/notes", (req, res) => {
    return res.json(currentNotes);
});

app.post("/api/notes", (req, res) => {
    var newNote = req.body;
    newNote.id = currentNotes.length + 1;

    currentNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(currentNotes));

    res.json(newNote);

    res.end();
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT);
})