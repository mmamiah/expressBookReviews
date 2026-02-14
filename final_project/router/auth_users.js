const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
