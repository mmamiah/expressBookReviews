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
  return res.json({message: "Success", username: username});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        return await getAllBooks()
            .then(resolvedBooks => res.json(resolvedBooks))
            .catch(error => res.status(500).json({message: error.message}));  
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: error.message});
    }
});

function getAllBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books) {
                resolve(books);
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
        return await getBookByISBN(isbn)
            .then(resolvedBooks => res.json({message: "Success", book: JSON.stringify(resolvedBooks)}))
            .catch(error => res.status(500).json({message: error.message})); 
    } catch (error) {
        console.error(error);
        return res.status(404).json({message: error.message});
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
        return await getBookByAuthor(author)
            .then(resolvedBooks => res.json({message: "Success", book: JSON.stringify(resolvedBooks)}))
            .catch(error => res.status(500).json({message: error.message}));
    } catch (error) {
        console.error(error);
        return res.status(404).json({message: error.message});
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
    return await getBookDetails(title)
        .then(resolvedBooks => res.json({message: "Success", book: JSON.stringify(resolvedBooks)}))
        .catch(error => res.status(500).json({message: error.message}));
  } catch(error) {
    console.error(error);
    return res.status(404).json({message: error.message});
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
public_users.get('/review',function (req, res) {
    let result = {};
    for(prop in books) {
        result[prop] = books[prop].reviews;
    }
    return res.json({message: "Success", reviews: JSON.stringify(result)});
});

public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        return res.json({message: "Success", reviews: JSON.stringify(book.reviews), isbn: isbn});
    }
    return res.status(404).json({message: "Failed to retrieve the book with ISBN =[" + isbn + "]"});
});


// Add a book review
public_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const username = req?.session?.authorization['username'];
    if (!book) {
        return res.status(404).json({ message: "The book ISBN [" + isbn + "] does not exists." });
    }
    if (!username) {
        return res.status(404).json({ message: "Please login." });
    }
    book.reviews[username] = req.body.review;
    return res.json({ message : "Review successfull added.", username: username, isbn: isbn, reviews : req.body.review});
});

// Delete a book review
public_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const username = req?.session?.authorization['username'];
    if (!book) {
        return res.status(404).json({ message: "The book ISBN [" + isbn + "] does not exists." });
    }
    if (!username) {
        return res.status(404).json({ message: "Please login." });
    }
    let reviews = undefined;
    console.log("username: ", username);
    for (const prop in book.reviews) {
        console.log("selected property: ", prop);
        if (prop === username) {
            console.log("Skipping user review: ", username);
        } else {
            if (reviews === undefined) {
                reviews = {};
            }
            reviews[prop] = book.reviews[prop];
        }
    }
    book.reviews = reviews;
    return res.json({ message : "Review successfull deleted.", username: username, isbn: isbn, reviews : req.body.review});
});

module.exports.general = public_users;
