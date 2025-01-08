require("dotenv").config();

const config = require("./config.json");

const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");


const express = require("express");
const cors = require("cors");
const app = express();


const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");



app.use(express.json());

// app.use(
//     cors({
//         origin: "*",
//     })
// );
app.use(cors({
    origin: "http://localhost:5173", // Adjust to your frontend's address
    credentials: true,
}));


app.get("/", (req, res)=>{
    res.json({data: "hello"});
});

app.post("/create-account", async (req, res)=>{
const { fullName, email, password } = req.body;

if (!fullName){
    return res
    .status(400)
    .json({ error: true, message: 'Full Name is required'});
}

if (!email){
    return res.status(400).json({ error: true, message: "Email is required"});
}

if (!password){
    return res
    .status(400)
    .json({ error: true, message: "Password is required"});
}

const isUser = await User.findOne({ email: email});

if (isUser){
    return res.json({
        error: true,
        message: "User already exists",
    });

}

const user = new User({
    fullName,
    email,
    password,
})

await user.save();

const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn:"700d",
});
return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
});
});

app.post("/login", async (req, res) =>{
    const { email, password } = req.body;
    if (!email){
        return res.status(400).json({ message: "Email is required"});

    }
    if (!password) {
        return res.status(400).json({ message: "Password is required"});
    }

    const userInfo = await User.findOne({ email: email});

    if (!userInfo){
        return res.status(400).json({message: "User not found"});
    }

    if (userInfo.email==email && userInfo.password==password){
        const user = {user: userInfo};
        const accessToken = jwt.sign({ userId: userInfo._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "700d",  // Set the expiration to 1 hour.
        });
        
        
        
        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });

    } else {
        return res.status(400).json({
            error: true,
            message:"invalid Credentials",
        });
    }
});

// app.get("/get-user", authenticateToken, async (req,res)=>{
//     const user = req.user;

//     const isUser = await User.findOne({_id: user._id});

//     if (!isUser){
//         return res.sendStatus(401);
//     }

//     return res.json({
//         user:isUser,
//         message: "",

//     });
// });

app.get("/get-user", authenticateToken, async (req, res) => {
    const user = req.user;

    console.log("User from request:", user); // Debugging

    try {
        const isUser = await User.findOne({ _id: user.userId });

        console.log("User found in DB:", isUser); // Debugging

        if (!isUser) {
            return res.status(401).json({ error: true, message: "Unauthorized: User not found" });
        }

        return res.json({
            error: false,
            user: {
                fullName: isUser.fullName,
                email: isUser.email,
                _id: isUser._id,
                createdOn: isUser.createdOn,
            },
            message: "User retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;

    try {
        // Fetch the full user object based on the userId in the token
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        // Proceed with updating the note
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned;

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        console.error("Error editing note:", error.message);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// app.get("/get-all-notes/", authenticateToken, async (req, res) => {
//     const  user = req.user;

//     try{
//         const notes = await Note.find({userId: user._id }).sort({ isPinned: -1 });
//         return res.json({
//             error:false,
//             notes,
//             message: "All notes retrieved successfully",
//         });

//     } catch (error){
//         return res.status(500).json({
//             error:true,
//             message: "Internal Server Error",
//         });
//     }
// });

// app.get("/get-all-notes", authenticateToken, async (req, res) => {
//     const user = req.user;

//     console.log("Decoded user object:", user);

//     try {
//         // Validate userId
//         if (!user || !user.userId) {
//             return res.status(400).json({
//                 error: true,
//                 message: "Invalid user data",
//             });
//         }

//         // Fetch notes from the database
//         const notes = await Note.find({ userId: user.userId }).sort({ isPinned: -1 });
//         console.log("Fetched notes:", notes);


//         // Check if notes are found
//         if (!notes || notes.length === 0) {
//             return res.status(404).json({
//                 error: true,
//                 message: "No notes found for this user",
//             });
//         }

//         // Return notes
//         return res.json({
//             error: false,
//             notes,
//             message: "All notes retrieved successfully",
//         });
//     } catch (error) {
//         console.error("Error fetching notes:", error);
//         return res.status(500).json({
//             error: true,
//             message: "Internal Server Error",
//         });
//     }
// });

app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const user = req.user;

    console.log("Decoded user object:", user);

    try {
        // Validate userId
        if (!user || !user.userId) {
            return res.status(400).json({
                error: true,
                message: "Invalid user data",
            });
        }

        // Fetch notes from the database
        const notes = await Note.find({ userId: user.userId }).sort({ isPinned: -1 });
        console.log("Fetched notes:", notes);

        // Always return a 200 status, even if no notes are found
        return res.status(200).json({
            error: false,
            notes, // This will be an empty array if no notes are found
            message: notes.length > 0 ? "All notes retrieved successfully" : "No notes found for this user",
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});


// app.delete("/delete-note/:noteId", authenticateToken, async ( req, res )=>{
//     const noteId = req.params.noteId;
//     const user = req.user;

//     try{
//         const note = await Note.findOne({_id: noteId, userId: user._id });

//         if (!note){
//             return res.status(404).json({error:true, message:"Note not found"});

//         }
//         await Note.deleteOne({_id: noteId, userId: user._id });

//         return res.json({
//             error:false,
//             message:"Note deleted successfully",

//         });

//     } catch (error){
//         return res.status(500).json({
//             error:true,
//             message:"Internal Server Error",
//         });
//     }
// });

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user;

    try {
        // Ensure userId is used (not user._id)
        const note = await Note.findOne({ _id: noteId, userId: user.userId });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Delete the note
        await Note.deleteOne({ _id: noteId, userId: user.userId });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

//Update isPinned Valie

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const userId = req.user.userId; // Extracted from the token by authenticateToken

    console.log("User ID:", userId);
    console.log("Note ID:", noteId);

    try {
        // Update the note's isPinned field
        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, userId }, // Match note by ID and user ID
            { isPinned }, // Update operation
            { new: true } // Return the updated document
        );

        if (!updatedNote) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        return res.json({
            error: false,
            message: "Note updated successfully",
            note: updatedNote,
        });
    } catch (error) {
        console.error("Error updating note:", error); // Log error for debugging
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

//Search API
// app.get("/search-notes/", authenticateToken, async (req, res) => {
//     const user = req.user;
//     const query = req.query.query;

//     if (!query) {
//         return res
//         .status(400)
//         .json({ error: true, message: "Search query is required"});
//     }
//     try {
//         const matchingNotes = await Note.find({
//             userId: user._id,
//             $or: [
//                 { title: { $regex: new RegExp(query, "i")}},
//                 { content: { $regex: new RegExp(query, "i")}},


//             ],
//         });
//         return res.json({
//             error: false,
//             notes: matchingNotes,
//             message: "Notes matching the search query retrieved successfully",
//         });
//     } catch (error) {
//         return res.status(500).json({
//             error: true,
//             message: "Internal Server Error",
//         });
//     }

// });

app.get("/search-notes/", authenticateToken, async (req, res) => {
    console.log("User in /search-notes route:", req.user);

    const user = req.user;
    const searchQuery = req.query.query || ""; // Get the search query

    try {
        const matchingNotes = await Note.find({
            userId: user.userId,
            $or: [
                { title: { $regex: searchQuery, $options: "i" } }, // Match "title" (case-insensitive)
                { content: { $regex: searchQuery, $options: "i" } }, // Match "content" (case-insensitive)
                { tags: { $regex: searchQuery, $options: "i" } }, // Match any "tag" (case-insensitive)
            ],
        });

        console.log("Matching Notes:", matchingNotes);

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });
    } catch (error) {
        console.error("Error occurred:", error.message, error.stack);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});







app.post('/add-note', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.user; // Decoded token should set req.user
      const { title, content, tags } = req.body;
  
      if (!userId) {
        throw new Error("User ID is missing from the token.");
      }
  
      const newNote = new Note({
        title,
        content,
        tags,
        userId, // Attach the userId here
      });
  
      const savedNote = await newNote.save();
      res.status(201).json({ message: 'Note created successfully', note: savedNote });
    } catch (error) {
      console.error('Error in /add-note:', error);
      res.status(500).json({ message: 'Failed to create note', error: error.message });
    }
  });
  

  






// app.post("/add-note", authenticateToken, async (req, res)=>{


//     const { title, content, tags } = req.body;
//     const { user } = req.user;

//     if (!title){
//         return res.status(400).json({ error: true, message: "Title is required"});

//     }

//     if (!content){
//         return res
//         .status(400)
//         .json({ error: true, message: "Content is required"});
        
//     }

//     try {
//         const note = new Note({
//             title, 
//             content, 
//             tags: tags || [],
//             userId: user._id,
//         });

//         await note.save();
//         return res.json({
//             error: false,
//             note, 
//             message: "Note added successfully",
//         });

//     } catch (error) {
//         return res.status(500).json({
//             error: true,
//             message: "Internal Server Error",
//         });
//     }



// });

// app.put("/edit-note/:noteId", authenticateToken, async (req, res)=>{


//     const noteId = req.params.noteId;
//     const { title, content, tags, isPinned } = req.body;
//     const { userId } = req.user;

//     console.log("User from token:", userId); // Debugging
//     console.log("Note ID:", noteId); // Debugging


//     if (!title && !content && !tags){
//         return res
//         .status(400)
//         .json({ error: true, message: "No changes provided"});
//     }


//     try {
//         const note = await Note.findOne({ _id: noteId, userId: user._id });

//         if (!note){
//             return res.status(404).json({ error:true, message: "Note not found"});

//         }
//         if (title) note.title=title;
//         if (content) note.content=content;
//         if (tags) note.tags=tags;
//         if (isPinned) note.isPinned = isPinned;

//         await note.save();

//         console.log("Updated Note:", note); // Debugging


        
//         return res.json({
//             error: false,
//             note,
//             message: "Note updated successfully",
//         });
//     } catch (error) {
//         console.error("Error editing note:", error.message); // Debugging
//         return res.status(500).json({
//             error: true,
//             message: "Internal Server Error",
//         });
//     }



// })

app.listen(8000);

module.exports=app;