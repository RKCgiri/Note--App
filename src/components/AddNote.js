import React, { useContext, useState } from 'react'
import Notecontext from '../context/notes/NoteContext';

const AddNote = () => {
    const context = useContext(Notecontext);
    const { addNote } = context;

    const [ note, setNote] = useState({ title: "", description: "", tag: "default" })
    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title: "", description: "", tag: "default" })
    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });  //New Object to prevent previous values 
    }
    return (
        <div className="container my-3">
            <h2>Add a Note</h2>
            <form className="my-3">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name='title' value={note.title} aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label" >Description</label>
                    <input type="text" className="form-control" id="description" value={note.description} name='description' onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label" >Tag</label>
                    <input type="text" className="form-control" id="tag" value={note.tag} name='tag' onChange={onChange} />
                </div>
                
                <button type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote
