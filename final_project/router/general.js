const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if (!req.body.username) {
    return res.status(404).json({message: "Username is missing"});
  } else if (!req.body.password) {
    return res.status(404).json({message: "Password is missing"});
  }

  const user = users.filter((user) => user.username === req.body.username);
  console.log(user);
  if (user.length > 0) {
    return res.status(404).json({message: "User already exists", payload: user});
  }
  users.push({
    username: req.body.username,
    password: req.body.password
  });
  return res.send("User registered");
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const result = await getAllBooks();   
        return res.send(JSON.stringify(result));
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Failed to collect data"});
    }
});

function getAllBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books) {
                resolve(JSON.stringify(books));
            } else {
                reject(new Error("Failed to retrieve the books"));
            }
        }, 1000);
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const book = await getBookByISBN(req.params.isbn); 
        if (book) {
            return res.send(book);
        }
        return res.status(404).json({message: "Not found"});
    } catch (error) {
        console.error(error);
        return res.status(404).json({message: "Failed to retrieve the book"});
    }
 });
  
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isbn && books) {
                resolve(books[isbn]);
            } else {
                reject(new Error("Failed to retrieve the book by ISBN n." + isbn));
            }
        }, 1000);
    });
}

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    
    try {
        let result = await getBookByAuthor(req.params.author);
        if (result) {
            return res.json(result);
        } else {
            return res.status(404).json({message: "Not found"});
        }
    } catch (error) {
        console.error(error);
        return res.status(404).json({message: "Failed to retrieve the book by author"});
    }
});

function getBookByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let result = [];
            for (var isbn in books) {
              if (books[isbn].author === author) {
                  result.push(books[isbn]);
              }
            }
            if (result.length > 0 ) {
              return resolve(result);
            }
            return reject(new Error({message: "Book not found"}));
        }, 1000);
    });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let result = [];
  for (var isbn in books) {
    if (books[isbn].title === req.params.title) {
        result.push(books[isbn]);
    }
  }
  if (result.length > 0 ) {
    return res.status(200).json(result);
  }
  return res.status(404).json({message: "Not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let reviews = books[req.params.isbn];
    if (reviews) {
        return res.status(200).json(reviews);
    }
    return res.status(404).json({message: "Not found"});
});

module.exports.general = public_users;
