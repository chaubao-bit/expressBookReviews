const express = require('express');
const axios = require('axios');
const router = express.Router();

// Task 1: Get all books
router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.example.com/books');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Task 2: Get books by ISBN
router.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        // Assuming you have a local books array or database
        const book = books.find(b => b.isbn === isbn || b.id === parseInt(isbn));
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Task 3: Get books by Author - Using Async/Await with Axios
router.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const response = await axios.get('https://api.example.com/books');
        const books = response.data.filter(book => 
            book.author && book.author.toLowerCase().includes(author.toLowerCase())
        );
        
        if (books.length > 0) {
            res.json(books);
        } else {
            res.status(404).json({ error: 'No books found by this author' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books by author' });
    }
});

// Task 4: Get books by Title - Using Promise callbacks with Axios
router.get('/title/:title', (req, res) => {
    const title = req.params.title;
    
    axios.get('https://api.example.com/books')
        .then(response => {
            const books = response.data.filter(book => 
                book.title && book.title.toLowerCase().includes(title.toLowerCase())
            );
            
            if (books.length > 0) {
                res.json(books);
            } else {
                res.status(404).json({ error: 'No books found with this title' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to fetch books by title' });
        });
});

// Task 5: Get book reviews
router.get('/review/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        // Check if book exists first
        const book = books.find(b => b.isbn === isbn || b.id === parseInt(isbn));
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        // Return reviews if they exist, or empty object if not
        const reviews = book.reviews || {};
        res.json(reviews);
    } catch (error) {
        res.status(404).json({ error: 'Book or reviews not found' });
    }
});

// Task 6: Add/Modify review (authenticated)
router.put('/auth/review/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const review = req.body.review;
        
        if (!review) {
            return res.status(400).json({ error: 'Review content is required' });
        }
        
        // Find the book
        const book = books.find(b => b.isbn === isbn || b.id === parseInt(isbn));
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        // Initialize reviews if it doesn't exist
        if (!book.reviews) {
            book.reviews = {};
        }
        
        // Add/modify review
        const username = req.session?.username || 'anonymous';
        book.reviews[username] = review;
        
        res.json({ 
            message: `Review for ISBN ${isbn} ${book.reviews[username] ? 'updated' : 'added'} successfully`,
            review: book.reviews
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add/modify review' });
    }
});

// Task 7: Delete review (authenticated)
router.delete('/auth/review/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        
        // Find the book
        const book = books.find(b => b.isbn === isbn || b.id === parseInt(isbn));
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        if (!book.reviews || Object.keys(book.reviews).length === 0) {
            return res.status(404).json({ error: 'No reviews found for this book' });
        }
        
        // Delete the review
        const username = req.session?.username || 'anonymous';
        if (book.reviews[username]) {
            delete book.reviews[username];
            res.json({ message: `Review for ISBN ${isbn} deleted successfully` });
        } else {
            res.status(404).json({ error: 'Review not found for this user' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

module.exports = router;
