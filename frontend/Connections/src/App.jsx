// import React from 'react'
// import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from './pages/Home/Home'
// import Login from './pages/Login/Login'
// import SignUp from './pages/SignUp/SIgnUp' //Might have to edit page name to "SignUp"



// const routes =(
//   <Router>
//   <Routes>
//   <Route path ="/dashboard" exact element={<Home />} />
//   <Route path ="/login" exact element={<Login />} />
//   <Route path ="/signup" exact element={<SignUp />} />
//   </Routes>
//   </Router>
// );

// const App = () => {
//   return <div>{routes}</div>;
  
// }

// export default App
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Add Navigate for redirects
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SIgnUp'; // Ensure the file name matches

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route: Redirects '/' to '/login' */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Other routes */}
        <Route path="/dashboard" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" exact element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;


