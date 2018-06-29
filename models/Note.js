
var mongoose = require("mongoose");

// reference to the Schema contructor 
var Schema = mongoose.Schema;

// create a new NoteSchema object 
var NoteSchema = new Schema({
    title: String, 
    body: String,
    date: { 
        type: Date, 
        default: Date.now 
    },  
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;