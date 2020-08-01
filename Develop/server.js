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

// Reads current notes (db.json) in JSON format
var currentNotes = JSON.parse(fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf-8"))

// Routes
// =============================================================
// Returns notes.html file
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});

// Read current notes and return all saved notes as JSON
app.get("/api/notes", (req, res) => {
    return res.json(currentNotes);
});

// Receive new note, add it to db.json and return the new note
app.post("/api/notes", (req, res) => {
    var newNote = req.body;
    newNote.id = currentNotes.length + 1;

    currentNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(currentNotes));

    res.json(newNote);

    res.end();
});

// Delete a selected note
app.delete("/api/notes/:id", (req, res) => {
    let removedID = req.params.id;

    // Remove notes of the selected ID
    for (var i = 0; i < currentNotes.length; i++) {
        const note = currentNotes[i];
        if (note) {
            if (note.id == removedID) {
                // At position [i] remove 1 item which is the note of the selected ID
                currentNotes.splice(i, 1);
            }
        }
    }

    // Rearrange notes
    for (var i = 1; i < currentNotes.length; i++) {
        const note = currentNotes[i];
        if (note) {
            note.id = i;
        }
    }

    // Then rewrite the file
    fs.writeFileSync("./db/db.json", JSON.stringify(currentNotes));

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