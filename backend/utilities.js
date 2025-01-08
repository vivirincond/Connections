// const jwt = require("jsonwebtoken");


// function authenticateToken(req, res, next){
//     const autHeader=req.headers["authorization"];
//     const token = autHeader && autHeader.split(" ")[1];




//     if (!token) return res.sendStatus(401);

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(401); // Expired or invalid token
//         req.user = user; // Attach user info to request
//         next();
//     });
    
// }



// module.exports = {
//     authenticateToken,
// }
// const jwt = require("jsonwebtoken");

// function authenticateToken(req, res, next) {
//     const autHeader = req.headers["authorization"];
//     const token = autHeader && autHeader.split(" ")[1]; // Extract the token
//     console.log("Token extracted:", token);           // Log the token


//     if (!token) return res.sendStatus(401); // No token provided, Unauthorized

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             console.error("Token verification failed:", err); // Log the verification error
//             return res.sendStatus(401); // Invalid or expired token
//         }

//         // console.log("Decoded user:", user); // This should print the decoded user data (e.g., { userId: <id> })
//         // req.user = user; // Attach decoded user to the request object
//         console.log("Decoded user:", decoded); // Debugging
//         req.user = { userId: decoded.userId }; // Store the userId directly in req.user
//         next(); // Proceed to the next middleware
//     });
// }

// module.exports = {
//     authenticateToken,
// };

// const jwt = require("jsonwebtoken");

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers["authorization"]; // Corrected typo: `autHeader` -> `authHeader`
//     const token = authHeader && authHeader.split(" ")[1]; // Extract the token

//     console.log("Authorization Header:", authHeader); // Debugging: Log the entire header
//     console.log("Token extracted:", token); // Debugging: Log the extracted token

//     if (!token) {
//         console.error("Unauthorized: No token provided");
//         return res.status(401).json({ error: true, message: "Unauthorized: No token provided" });
//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             console.error("Token verification failed:", err); // Log the verification error
//             if (err.name === "TokenExpiredError") {
//                 return res.status(401).json({ error: true, message: "Unauthorized: Token expired" });
//             }
//             return res.status(401).json({ error: true, message: "Unauthorized: Invalid token" });
//         }

//         console.log("Decoded token:", decoded); // Debugging: Log the decoded token data
//         req.user = { userId: decoded.userId }; // Store the userId in req.user
//         next(); // Proceed to the next middleware or route handler
//     });
// }

// module.exports = {
//     authenticateToken,
// };

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract the token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    console.log("Token received:", token); // Log the token received by the backend

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err); // Log the verification error
            return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }

        console.log("Decoded token:", decoded); // Log the decoded token

        req.user = { userId: decoded.userId }; // Attach the decoded userId to the request
        next(); // Proceed to the next middleware
    });
}

module.exports = { authenticateToken };


