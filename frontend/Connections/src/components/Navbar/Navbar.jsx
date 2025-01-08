// import React, { useState } from 'react'
// import ProfileInfo from "../Cards/ProfileInfo"
// import { useNavigate } from "react-router-dom";
// import SearchBar from "../SearchBar/SearchBar"

// const Navbar = ({userInfo, onSearchNote }) => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const navigate = useNavigate();

//   const onLogout = () =>{
//     localStorage.clear()

//     navigate("/login");
//   };

//   const handleSearch = () =>{
//     if(searchQuery){
//       onSearchNote(searchQuery);
//     }

//   };
//   const onClearSearch = () =>{
//     setSearchQuery("");
//   };
//   return (
//     <div className="bg-white flex items-center justify-between px-6 and py-2 drop-shadow">
//        <h2 className="text-xl font-medium text-black py-2">Connect10ns</h2> 

//        <SearchBar
//         value={searchQuery}
//        onChange={({target}) =>{
//         setSearchQuery(target.value);

//        }}
//        handleSearch={handleSearch}
//        onClearSearch={onClearSearch}
//        />

//        <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
//     </div>
//   );
// };

// export default Navbar;

// import React, { useState } from "react";
// import ProfileInfo from "../Cards/ProfileInfo";
// import { useNavigate } from "react-router-dom";
// import SearchBar from "../SearchBar/SearchBar";
// import { useLocation } from "react-router-dom";




// const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {



  
//   const [searchQuery, setSearchQuery] = useState("");

//   const navigate = useNavigate();

//   const onLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const handleSearch = () => {
//     if (searchQuery) {
//       onSearchNote(searchQuery); // Trigger search
//     }
//   };

//   const onClearSearch = () => {
//     setSearchQuery(""); // Clear search input field
//     handleClearSearch(); // Trigger parent's handleClearSearch to reset notes
//   };

//   return (
//     <div className="bg-white flex items-center justify-between px-6 and py-2 drop-shadow">
//       <h2 className="text-3xl font-medium text-black py-2 ml-4">CONNECT10NS</h2>

//       <SearchBar
//         value={searchQuery}
//         onChange={({ target }) => {
//           setSearchQuery(target.value);
//         }}
//         handleSearch={handleSearch}
//         onClearSearch={onClearSearch} // Call updated clear search
//       />

//       <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
//     </div>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { useLocation } from "react-router-dom";
import Logo from '../../assets/images/ConnectionsLogo_processed.png';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <div className="flex items-center">
        <img src={Logo} alt="Connections Logo" className="w-16 h-16 mr-2" />
        <h2 className="text-3xl font-medium text-black py-2 ml-4">CONNECT10NS</h2>
      </div>

      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      )}

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;



