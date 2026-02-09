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

  const username = req.body.username;
  const user = users.filter((user) => user.username === username);
  console.log(user);
  if (user.length > 0) {
    return res.status(404).json({message: "User " + username + " already exists", username: username});
  }
  users.push({
    username: username,
    password: req.body.password
  });
  return res.json({message: "User [" + username + "] successfull registered", username: username});
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
    const isbn = req.params.isbn;
    try {
        const book = await getBookByISBN(isbn); 
        if (book) {
            return res.json({message: "Successfull found the book", instanceof: isbn, book: book});
        }
        return res.status(404).json({message: "Book with ISBN = [" + isbn + "] not found"});
    } catch (error) {
        console.error(error);
        return res.status(404).json({message: "Failed to retrieve the book with ISBN =[" + isbn + "]"});
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
    const author = req.params.author;
    try {
        let result = await getBookByAuthor(author);
        if (result) {
            return res.json({message: "Book successfully found", book: result});
        } else {
            return res.status(404).json({message: "Book with author = [" + author + "] not found"});
        }
    } catch (error) {
        console.error(error);
        return res.status(404).json({message: "Failed to retrieve the book with author= [" + author + "]"});
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
public_users.get('/title/:title',async (req, res) => {
    const title = req.params.title;
  try {
    let result = await getBookDetails(title);
    if (result) {
        return res.json({message: "Successfull founf the boo", book: result});
    } else {
        return res.status(404).json({message: "Book with title = [" + title + "] not found"});
    }
  } catch(error) {
    console.error(error);
    return res.status(404).json({message: "Failed to retrieve the book with title= [" + title + "]"});
  }
});

function getBookDetails(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let result = [];
            for (var isbn in books) {
              if (books[isbn].title === title) {
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

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let reviews = books[isbn];
    if (reviews) {
        return res.json({message: "Reviews successfull collected", reviews: reviews, isbn: isbn});
    }
    return res.status(404).json({message: "Failed to retrieve the book with ISBN =[" + isbn + "]"});
});

module.exports.general = public_users;
