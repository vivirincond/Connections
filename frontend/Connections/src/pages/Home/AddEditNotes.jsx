import React, { useState } from 'react'
import TagInput from "../../components/Input/TagInput"
import { MdClose } from "react-icons/md";
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {

    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);

    const [error, setError] = useState(null);

    // const addNewNote = async () => {
    //     try {
    //         const response = await axiosInstance.post("/add-note", {
    //             title,
    //             content,
    //             tags,
    //         });

    //         if (response.data && response.data.note){
    //             getAllNotes()
    //             onClose()

    //         }
    //     } catch (error){
    //         if (error.response && error.response.data && error.response.data.message){
    //             setError(error.response.data.message);
    //         }
    //     }
    // };
    const addNewNote = async () => {
        try {
          console.log('Adding note:', { title, content, tags });
          const response = await axiosInstance.post("/add-note", {
            title,
            content,
            tags,
          });
      
          console.log('Response:', response.data);
      
          if (response.data && response.data.note) {
            console.log("Triggering toast for new note addition");
            showToastMessage("Note Added Successfully");
            onClose();
            getAllNotes();

          }
        } catch (error) {
          console.error('Error in addNewNote:', error);
          if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError('An unexpected error occurred');
          }
        }
      };
      
    const editNote = async () =>{
        const noteId = noteData._id;
        try {
            console.log('Adding note:', { title, content, tags });
            // const response = await axiosInstance.post("/edit-note/" + noteId, {
            //   title,
            //   content,
            //   tags,
            // });
            const response = await axiosInstance.put(`/edit-note/${noteId}`, {
                title,
                content,
                tags,
              });
              
        
            console.log('Response:', response.data);
        
            if (response.data && response.data.note) {
                showToastMessage("Note Updated Successfully");
              getAllNotes();
              onClose();
            }
          } catch (error) {
            console.error('Error in addNewNote:', error);
            if (error.response && error.response.data && error.response.data.message) {
              setError(error.response.data.message);
            } else {
              setError('An unexpected error occurred');
            }
          }
    };

    const handleAddNode = () =>{
        if (!title) {
            setError("Please enter a title");
            return;
        }

        if (!content){
            setError("Please enter the content");
            return;
        }

        setError("");

        if (type=="edit"){
            editNote();
        }
        else{
            addNewNote();
        }
    };


  return (
    <div className="relative">

        <button
        className="w-10 h-10 rounded-full flex items-center justifyc-denter absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}>
            <MdClose className="text-xl text-slate-400"/>
        </button>

        <div className="flex flex-col gap-2">
            <label className="input-label">TITLE</label>
            <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="Jim Gordon"
            value={title}
            onChange={({target})=>setTitle(target.value)}
            />

        </div>

        <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">CONTENT</label>
            <textarea
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Commissioner of Gotham City Police Department
Email: jgordon@gmail.com"
            rows={10}
            value={content}
            onChange={({target})=>setContent(target.value)}
            />
        </div>
        <div className="mt-3">
            <label className="input-label">TAGS</label>
            <TagInput tags={tags} setTags={setTags}/>
            
        </div>

        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
        <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNode}>
       {type === "edit" ? "UPDATE" : "ADD"}
        </button>


      
    </div>
  )
}

export default AddEditNotes;
