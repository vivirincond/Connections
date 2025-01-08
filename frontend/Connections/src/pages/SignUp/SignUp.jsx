import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import {Link, useNavigate} from "react-router-dom";
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from "../../utils/helper";
import axiosInstance from '../../utils/axiosInstance'; // Import axiosInstance


const SignUp = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
    
        if (!name) {
            setError("Please enter your name");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (!password) {
            setError("Please enter a password");
            return;
        }
    
        try {
            const response = await axiosInstance.post("/create-account", {
                fullName: name,
                email: email,
                password: password,
            });
            console.log(response);

            // if (response.data && response.data.error) {
            //                 // Save token to localStorage
            //                 setError(response.data.message)
            //                 return
            //             }
    
            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken); // Save token from response
                console.log("Redirecting to dashboard..."); // Debug log
                navigate("/dashboard"); // Redirect to dashboard
            }
            else{
                setError("SignUp failed.")
            }
            
        } catch (error) {
            console.error("Error response:", error.response); // Debugging

            // Handle API error response
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Show backend error message
            } else {
                setError("An unexpected error occurred. Please try again."); // Fallback error message
            }
            // console.error("Error response:", error.response);
            // if (error.response && error.response.status === 409) {
            //     setError("User already exists");
            // } else if (error.response && error.response.data && error.response.data.message) {
            //     setError(error.response.data.message);
            // } else {
            //     setError("An unexpected error occurred. Please try again.");
            // }
        }
    };
    


    // const handleSignUp = async (e) => {
    //     e.preventDefault();

    //     if (!name){
    //         setError("Please enter your name");
    //         return;
    //     }
    //     if (!validateEmail(email)){
    //         setError("Please enter a valid email address");
    //         return;
    //     }
    //     if (!password){
    //         setError("Please enter a password");
    //         return;
    //     }
    //     setError("")

    //     //SignUP API Call

    //     try {
    //         const response = await axiosInstance.post("/create-account", {
    //             fullName: name,
    //             email: email,
    //             password: password,
    //         });
    //         console.log('API Response:', response); // Log the full response for debugging
            


    //         // Check for accessToken in response
    //         if (response.data && response.data.error) {
    //             // Save token to localStorage
    //             setError(response.data.message)
    //             return
    //         }
    //         if(response.data && response.data.accessToken) {
    //             localStorage.setItem("token", response.data.accessToken)
    //             navigate("/dashboard");
    //         }
    //     } catch (error) {
    //         console.error("Error response:", error.response); // Debugging

    //         // Handle API error response
    //         if (error.response && error.response.data && error.response.data.message) {
    //             setError(error.response.data.message); // Show backend error message
    //         } else {
    //             setError("An unexpected error occurred. Please try again."); // Fallback error message
    //         }
    //     }

    // };

  return (
    <>
        <Navbar />

        <div className="flex items-center justify-center mt-28">
            <div className="w-96 border rounded bg-white px-7 py-10">
                <form onSubmit={handleSignUp}>
                <h4 className="text-2xl mb-7 text-center">Sign Up</h4>

                    <input 
                    type="text" 
                    placeholder="Name" 
                    className="input-box" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                    
                    <input 
                    type="text" 
                    placeholder="Email" 
                    className="input-box" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <PasswordInput 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />

                                {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
                    
                                <button type="submit" className="btn-primary">
                                    Create Account
                                </button>
                    
                                <p className="text-sm text-center mt-4">
                                    Already have an account?{" "}
                                    <Link to="/login" className="font-medium text-primary underlined">
                                    Login
                                    </Link>
                                </p>
                </form>
            </div>
        </div>
        </>
  );
};

export default SignUp;
