const express = require('express');
const Notes = require('../models/Notes'); // Import Notes model
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


// ROUTE 1: Get all the notes using GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ROUTE 2: Add a new note using POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title ').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 charecters ').isLength({ min: 5 })
], async (req, res) => {

    try {
        // If there is error then send the user  there is a bad request
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() })
        }

        const { title, description, tag } = req.body;
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// ROUTE 3: Delete an existing note using PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find the note to updated and update it
        const note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }


        const updatedNote = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ updatedNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})


// ROUTE 4: Update an existing note using DELETE "/api/notes/updatenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    //Find the note to be deleted and delete it 
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        //Allowes deletion only if the user own the note 
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "The Note has been deleted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;
