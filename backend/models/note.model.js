// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const noteSchema = new Schema({
//     title: { type: String, required: true

//     },
//     content: { type:String, required:true

//     },
//     tags: { type: [String], default: []

//     },
//     isPinned: { type:Boolean, default: false

//     },
//     userId: { type:String, required: true

//     },
//     createdOn: { type: Date, default: new Date().getTime()

//     },


// });

// module.exports = mongoose.model("Note", noteSchema);
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  isPinned: { type: Boolean, default: false},
  userId: { type: String, required: true }, // Ensure this is marked as required
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;

