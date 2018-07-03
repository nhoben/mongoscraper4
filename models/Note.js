
var mongoose = require("mongoose");

// this is the reference to the Schema contructor 
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
//export the note
module.exports = Note;