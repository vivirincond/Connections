// import React, { useState } from 'react';
// import Navbar from '../../components/Navbar/Navbar';
// import { Link, useNavigate } from "react-router-dom";
// import PasswordInput from '../../components/Input/PasswordInput';
// import { validateEmail } from "../../utils/helper";
// import axiosInstance from '../../utils/axiosInstance'; // Import axiosInstance

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState(null);

//     const navigate = useNavigate(); // Lowercase navigate

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         // Validate email
//         if (!validateEmail(email)) {
//             setError("Please enter a valid email address.");
//             return;
//         }

//         // Validate password
//         if (!password) {
//             setError("Please enter a password");
//             return;
//         }

//         setError(""); // Clear previous errors

//         // Login API Call
//         try {
//             const response = await axiosInstance.post("/login", {
//                 email: email,
//                 password: password,
//             });
//             console.log('API Response:', response); // Log the full response for debugging
            


//             // Check for accessToken in response
//             if (response.data && response.data.accessToken) {
//                 // Save token to localStorage
//                 localStorage.setItem("token", response.data.accessToken);
//                 navigate('/dashboard'); // Navigate to dashboard
//             }
//         } catch (error) {
//             console.error("Error response:", error.response); // Debugging

//             // Handle API error response
//             if (error.response && error.response.data && error.response.data.message) {
//                 setError(error.response.data.message); // Show backend error message
//             } else {
//                 setError("An unexpected error occurred. Please try again."); // Fallback error message
//             }
//         }
//     };

//     return (
//         <>
//             <Navbar />

//             <div className="flex items-center justify-center mt-28">
//                 <div className="w-96 border rounded bg-white px-7 py-10">
//                     <form onSubmit={handleLogin}>
//                         <h4 className="text-2xl mb-7">Login</h4>
//                         <input
//                             type="text"
//                             placeholder="Email"
//                             className="input-box"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />

//                         <PasswordInput
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />

//                         {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

//                         <button type="submit" className="btn-primary">
//                             Login
//                         </button>

//                         <p className="text-sm text-center mt-4">
//                             Not registered yet?{" "}
//                             <Link to="/signup" className="font-medium text-primary underlined">
//                                 Create an Account
//                             </Link>
//                         </p>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from "../../utils/helper";
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [typingText, setTypingText] = useState("");

    // Popup state
    const [showPopup, setShowPopup] = useState(true); // Controls popup visibility
    const [currentSlide, setCurrentSlide] = useState(0); // Tracks the active slide

    const navigate = useNavigate();

    // Slideshow content
    const slides = [
        "Welcome to Connect10ns! This is your first step to connecting with others.",
        "You can log in using your email and password or create an account.",
        "Once logged in, explore the features and grow your network!"
    ];

    // Typing effect for the header
    useEffect(() => {
        const text = "WELCOME TO CONNECT10NS!";
        let index = 0;

        const typingInterval = setInterval(() => {
            if (index < text.length) {
                setTypingText((prev) => text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter a password");
            return;
        }

        setError("");

        try {
            const response = await axiosInstance.post("/login", { email, password });
            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    // Slideshow navigation
    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <Navbar />
            <div className="login-container" style={{
                background: 'radial-gradient(circle, rgba(175,195,196,1) 0%, rgba(86,112,134,1) 100%)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '100px',
            }}>
                {/* Header with typing effect */}
                <div
                    className="relative flex items-center justify-center w-120 h-40 mx-auto mb-16 shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-full bg-white px-6"
                >
                    <h1 className="text-3xl font-bold text-center">{typingText}</h1>
                </div>

                {/* Popup with slideshow */}
                {showPopup && (
                    <div className="popup-container fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                        <div className="popup-content bg-white p-6 rounded-lg shadow-lg relative w-3/4 md:w-1/2 lg:w-1/3">
                            {/* Close Button */}
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-xl font-bold"
                                onClick={closePopup}
                            >
                                ×
                            </button>

                            {/* Slide Content */}
                            <p className="text-center text-lg mb-4">{slides[currentSlide]}</p>

                            {/* Navigation Arrows */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    className={`text-2xl ${currentSlide === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={handlePrev}
                                    disabled={currentSlide === 0}
                                >
                                    &#8249; {/* Left Arrow */}
                                </button>
                                <button
                                    className={`text-2xl ${currentSlide === slides.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={handleNext}
                                    disabled={currentSlide === slides.length - 1}
                                >
                                    &#8250; {/* Right Arrow */}
                                </button>
                            </div>

                            {/* Dots for Slide Tracking */}
                            <div className="flex justify-center mt-4 space-x-2">
                                {slides.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`h-2 w-2 rounded-full ${index === currentSlide ? "bg-blue-500" : "bg-gray-300"}`}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Login Form */}
                <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
                    <form onSubmit={handleLogin}>
                        <h4 className="text-2xl mb-7 text-center">Login</h4>
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
                            Login
                        </button>
                        <p className="text-sm text-center mt-4">
                            Not registered yet?{" "}
                            <Link to="/signup" className="font-medium text-primary underline">
                                Create an Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;







