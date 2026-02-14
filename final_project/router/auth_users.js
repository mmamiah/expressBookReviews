const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=> { 
    const user = users.filter((usr) => usr.username === username && usr.password === password);
    return (!user || user.length == 0) ? false : true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({data: password}, 'fingerprint_customer', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: false });
        res.cookie('username', username, { httpOnly: true, secure: false });
        return res.json({ message : "Login success", username : username });
    }
    return res.status(401).json({ message: "Invalid username or password" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
