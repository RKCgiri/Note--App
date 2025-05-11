import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState =(props)=>{
    const host="http://localhost:5000";
    const notesInitial=[]
    
      const [notes, setNotes] = useState(notesInitial);

   
      // GET all Notes
     const getNotes=async ()=>{
        //TODO API call
        const response= await fetch(`${host}/api/notes/fetchallnotes`,{
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'auth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdlMmJiMjMxOGRhMThkNzJlZTM3ODY0In0sImlhdCI6MTc0MjkxMjM3NX0.w0vIYeEazjI4qymFbsMpYB-i6sSVk5wgF2rlEvjSdDc'
            },
           
        });
        const json =await response.json();
        console.log(json);
        setNotes(json);
        
     }
     

     // Add a Note
     const addNote=async (title,description,tag)=>{
        //TODO API call
        const response= await fetch(`${host}/api/notes/addnote`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'auth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdlMmJiMjMxOGRhMThkNzJlZTM3ODY0In0sImlhdCI6MTc0MjkxMjM3NX0.w0vIYeEazjI4qymFbsMpYB-i6sSVk5wgF2rlEvjSdDc'
            },
            body: JSON.stringify({title,description,tag}),
        });
        
        const json=response.json();
        console.log(json);
        
        
        console.log("Add note")
        let note={
            "_id": "67e2ba18d9y8228690186d",
            "user": "67e2bb2318da18d72ee37864",
            "title": title,
            "description": description,
            "tag": tag,
            "date": "2025-03-25T14:35:54.663Z",
            "__v": 0
          };
        setNotes(notes.concat(note));
     }
     
     // Delete a Note
     const deleteNote=async(id)=>{
        // API call
        const response= await fetch(`${host}/api/notes/deletenote/${id}`,{
            method: 'DELETE',
            headers:{
                'Content-Type':'application/json',
                'auth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdlMmJiMjMxOGRhMThkNzJlZTM3ODY0In0sImlhdCI6MTc0MjkxMjM3NX0.w0vIYeEazjI4qymFbsMpYB-i6sSVk5wgF2rlEvjSdDc'
            },
        });
        const json= await response.json();
        console.log(json);
        
        const newNote= notes.filter((note)=>{ return note._id !==id })
        console.log("Deleting the node with id "+id);
        setNotes(newNote);
     }

     //Edit a Note
     const editNote=async (id,title,description,tag)=>{
            //API call
                const response= await fetch(`${host}/api/notes/updatenote/${id}`,{
                    method: 'PUT',
                    headers:{
                        'Content-Type':'application/json',
                        'auth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdlMmJiMjMxOGRhMThkNzJlZTM3ODY0In0sImlhdCI6MTc0MjkxMjM3NX0.w0vIYeEazjI4qymFbsMpYB-i6sSVk5wgF2rlEvjSdDc'
                    },
                    body: JSON.stringify({title,description,tag}),
                });
                const json= await response.json();
                console.log(json);
                
                let newNotes = JSON.parse(JSON.stringify(notes));

            //Logic to edit client
            for (let index = 0; index < newNotes.length; index++) {
                const element = newNotes[index];
                if(element._id===id){
                    newNotes[index].title=title;
                    newNotes[index].description=description;
                    newNotes[index].tag=tag;
                    break;
                }
                
                
            }
            setNotes(newNotes);
     }


    return (
        <NoteContext.Provider value={{ notes,addNote,deleteNote,editNote,getNotes }}>{props.children}</NoteContext.Provider>
    )
}
export default NoteState;