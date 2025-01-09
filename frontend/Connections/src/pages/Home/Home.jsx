// //import React, { useState } from 'react';
// import React, { useState, useEffect } from 'react';
// import Navbar from "../../components/Navbar/Navbar";
// import NoteCard from "../../components/Cards/NoteCard";
// import { MdAdd } from "react-icons/md";
// import AddEditNotes from "../../pages/Home/AddEditNotes";
// import { useNavigate } from "react-router-dom";
// import Modal from "react-modal";
// import axiosInstance from '../../utils/axiosInstance'; // Import axiosInstanceZ




// const Home = () => {

//   const [openAddEditModal, setOpenAddEditModal] = useState({
//     isShown: false,
//     type: "add",
//     data: null,
//   });

//   const [userInfo, setUserInfo] = useState(null);

//   const navigate = useNavigate();

//   const getUserInfo = async () => {
//     try {
      
//       const response = await axiosInstance.get("/get-user");
//       if (response.data && response.data.user) {
//         setUserInfo(response.data.user);
//       }
//     } catch (error) {
//       if (error.response.status ===401) {
//         console.log("401 WHAT");
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };

//   useEffect(()=>{
//     getUserInfo();
//     return () => {};
//   }, []);

//   return (
//    <>
//    <Navbar userInfo={userInfo} />
//    <div className="container mx-auto px-4 py-6">
//     <div className="grid grid-cols-3 gap-4 mt-8">

//     <NoteCard 
//     title="Meeting on 7th April" 
//     date="3rd April 2024"
//     content="Meeting on 7th April Meeting on 7th April"
//     tags="#Meeting"
//     isPinned={true}
//     onEdit={()=>{}}
//     onDelete={()=>{}}
//     onPinNote={()=>{}}


//     />
    
//     </div>

//    </div>
//    <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10" 
//    onClick={() =>{
//     setOpenAddEditModal({ isShown: true, type: "add", data: null});
//    }}
//    >
//     <MdAdd className="text-[32px] text-white"/>
//    </button>
//    <Modal 
//    isOpen={openAddEditModal.isShown}
//    onRequestClose={()=>{}}
//    style={{
//     overlay: {
//       backgroundColor: "rgba(0,0,0,0.2)",
//     },
//    }}
//    contentLabel=""
//    className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
//    >

//    <AddEditNotes 
//    type={openAddEditModal.type}
//    noteData={openAddEditModal.data}
//    onClose={() => {
//     setOpenAddEditModal({ isShow: false, type: "add", data: null });
//     }} />
//    </Modal>
//    </>

//   );
// };

// export default Home;

import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import moment from "moment";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "../../pages/Home/AddEditNotes";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axiosInstance from '../../utils/axiosInstance'; // Import axiosInstance
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from '../../assets/images/add-notes.png';
import AddNotesImg1 from '../../assets/images/ConnectionsLogo_processed.png';
import NoDataImg from "../../assets/images/no-data.svg";
import AddNotesImg2 from '../../assets/images/ConnectionsLogo_processed.png';



const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);

  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data:noteDetails, type: "edit"});
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // Function to fetch user data based on token validation
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");

      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      } else {
        // If no valid user data is returned
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.log("Error while fetching user data:", error);
      // Handle token expiration or invalid token by clearing localStorage and redirecting to login
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        // Other errors
        navigate("/login");
      }
    }
  };

  // const getAllNotes = async () =>{
  //   try {
  //     const response = await axiosInstance.get("/get-all-notes");
  //     if (response.data && response.data.notes){
  //       setAllNotes(response.data.notes || []);
  //     } 
  //   } catch (error) {
  //     console.log("An unexpected error occurred. Please try again.");
  //   }
  // };
  const getAllNotes = async () => {
    try {
        const response = await axiosInstance.get("/get-all-notes");
        console.log("getAllNotes response:", response.data);
        if (response.data && response.data.notes) {
            setAllNotes(response.data.notes);
        } else {
            console.log("No notes found.");
            setAllNotes([]);
        }
    } catch (error) {
        console.error("Error fetching notes:", error.message);
    }
};


//   const getAllNotes = async () => {
//     try {
//         const response = await axiosInstance.get("/get-all-notes");
//         if (response.data && response.data.notes) {
//             setAllNotes(response.data.notes);
//         } else {
//             console.log("No notes found.");
//         }
//     } catch (error) {
//         if (error.response?.status === 404) {
//             console.error("No notes found for this user.");
//         } else {
//             console.error("An error occurred:", error.message);
//         }
//     }
// };

// const deleteNote = async (data) => {
//   const noteId=data._id
//   try {
//     console.log('Deleting note:', { title, content, tags });
//     const response = await axiosInstance.delete("/delete-note", {
//       title,
//       content,
//       tags,
//     });

//     console.log('Response:', response.data);

//     if (response.data && response.data.note) {
//       console.log("Triggering toast for new note deletion");
//       showToastMessage("Note Deleted Successfully", 'delete');
//       //onClose();
//       getAllNotes();

//     }
//   } catch (error) {
//     console.error('Error in deleteNote:', error);
//     if (error.response && error.response.data && error.response.data.message) {
//       setError(error.response.data.message);
//     } else {
//       setError('An unexpected error occurred');
//     }
//   }
// }
const deleteNote = async (data) => {
  const noteId = data._id; // Use the note ID from the data object
  try {
    console.log('Deleting note:', { title: data.title, content: data.content, tags: data.tags });

    // Make the DELETE request
    const response = await axiosInstance.delete(`/delete-note/${noteId}`); // Pass the note ID in the URL

    console.log('Response:', response.data);

    if (response.data && !response.data.error) {
      console.log("Triggering toast for note deletion");
      showToastMessage("Note Deleted Successfully", 'delete');
      getAllNotes(); // Refresh the notes list
    }
  } catch (error) {
    console.error('Error in deleteNote:', error);

    // Handle error (use toast instead of setError if setError is not available)
    if (error.response && error.response.data && error.response.data.message) {
      showToastMessage(error.response.data.message, 'error');
    } else {
      showToastMessage('An unexpected error occurred', 'error');
    }
  }
};

const onSearchNote = async (query) => {
  try{
    const response = await axiosInstance.get("/search-notes", {
      params: {query},
    });

    if (response.data && response.data.notes) {
      setIsSearch(true);
      setAllNotes(response.data.notes);
    }
    


  } catch (error) {
    console.log(error);
  }
};

const handleClearSearch = async () => {
  try {
      setIsSearch(false); // Reset search state
      const allNotesData = await getAllNotes(); // Fetch all notes
      if (allNotesData) {
          setAllNotes(allNotesData); // Explicitly set fetched notes
      }
  } catch (error) {
      console.error("Error clearing search:", error);
  }
};

const updateIsPinned = async (noteData) => {
  const noteId = noteData._id; // Get the note ID
  const updatedPinnedStatus = !noteData.isPinned; // Toggle isPinned value

  try {
    console.log("Updating pinned status for note:", { noteId, updatedPinnedStatus });

    // Make the PUT request with the updated `isPinned` status
    const response = await axiosInstance.put(`/update-note-pinned/${noteId}`, {
      isPinned: updatedPinnedStatus,
    });

    console.log("Response from update-note-pinned:", response.data);

    if (response.data && response.data.note) {
      showToastMessage("Note Updated Successfully", "success");
      getAllNotes(); // Refresh the notes list
    }
  } catch (error) {
    console.error("Error in updateIsPinned:", error);

    // Use toast for error notification
    if (error.response && error.response.data && error.response.data.message) {
      showToastMessage(error.response.data.message, "error");
    } else {
      showToastMessage("An unexpected error occurred while updating the note.", "error");
    }
  }
};


    



console.log("allNotes:", allNotes); // Debug `allNotes`



  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     navigate("/login"); // Redirect to login if no token is found
  //     return;
  //   }

  //   // Proceed with user info fetching if token is present
  //   getUserInfo();
  //   getAllNotes();

  // }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    getUserInfo();
    getAllNotes();
}, [navigate]);


  return (
    <>

      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
<div className="container mx-auto px-4">
  {allNotes.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {allNotes.map((item, index) => (
        <NoteCard
          key={item._id}
          title={item.title}
          date={item.createdOn}
          content={item.content}
          tags={item.tags}
          isPinned={item.isPinned}
          onEdit={() => handleEdit(item)}
          onDelete={() => deleteNote(item)}
          onPinNote={() => updateIsPinned(item)}
        />
      ))}
    </div>
  ) : (
    <EmptyCard
      imgSrc={isSearch ? AddNotesImg2 : AddNotesImg1}
      message={
        <div className="rounded-box">
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              lineHeight: "2rem",
              textAlign: "center",
              display: "block",
            }}
          >
            Start creating your first Connect10n! <br />
            Click the ADD button to jot down any contact information and additional categories about your new Connect10n!
          </span>
        </div>
      }
    />
  )}
</div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-black hover:bg-gray-700 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[34px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        //onRequestClose={() => {}}
          onRequestClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
        />


    </>
  );
};

export default Home;

