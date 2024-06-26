import { Router, Request, Response } from 'express';
import { Sequelize, Op } from 'sequelize';
import sequelize from './database';
import Book from './models/book';
import Author from './models/author';
import Store from './models/store';
import BookStore from './models/store_book';

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Hello");
});

//BOOKS ROUTES

// get all books
router.get('/books', async (req: Request, res: Response) => {
    const books = await Book.findAll({ include: [Author] });
    res.json(books);
});

// Create a book for an author
router.post('/books', async (req: Request, res: Response) => {
    try {
        const newBook = await Book.create(req.body);
        res.json(newBook);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// get book by id
router.get('/books/:id', async (req: Request, res: Response) => {
    const book = await Book.findByPk(req.params.id, { include: [Author] });
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// edit book
router.put('/books/:id', async (req: Request, res: Response) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// delete book
router.delete('/books/:id', async (req: Request, res: Response) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.status(204).send();
    } else {
        res.status(404).send('Book not found');
    }
});


//AUTHORS ROUTES

// get all authors
router.get('/authors', async (req: Request, res: Response) => {
    const authors = await Author.findAll();
    res.json(authors);
});

// Create an author
router.post('/authors', async (req: Request, res: Response) => {
    try {
        const newAuthor = await Author.create(req.body);
        res.json(newAuthor);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Get all books written by a certain author
router.get('/authors/:id/books', async (req: Request, res: Response) => {
    const bookstore = await Author.findAll({
        where: {
            id: req.params.id
        },
        include: [Book]
    });
    if (bookstore) {
        res.json(bookstore);
    } else {
        res.status(404).send('store not found');
    }
});

// get author by id
router.get('/authors/:id', async (req: Request, res: Response) => {
    const author = await Author.findByPk(req.params.id);
    if (author) {
        res.json(author);
    } else {
        res.status(404).send('Author not found');
    }
});

// edit author
router.put('/authors/:id', async (req: Request, res: Response) => {
    const author = await Author.findByPk(req.params.id);
    if (author) {
        await author.update(req.body);
        res.json(author);
    } else {
        res.status(404).send('Author not found');
    }
});

// delete author
router.delete('/authors/:id', async (req: Request, res: Response) => {
    const author = await Author.findByPk(req.params.id);
    if (author) {
        await author.destroy();
        res.status(204).send();
    } else {
        res.status(404).send('Author not found');
    }
});

//STORES ROUTES

// get all stores
router.get('/stores', async (req: Request, res: Response) => {
    const stores = await Store.findAll();
    res.json(stores);
});

// Create a store
router.post('/stores', async (req: Request, res: Response) => {
    try {
        const newStore = await Store.create(req.body);
        res.json(newStore);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// get store by id
router.get('/stores/:id', async (req: Request, res: Response) => {
    const store = await Store.findByPk(req.params.id);
    if (store) {
        res.json(store);
    } else {
        res.status(404).send('store not found');
    }
});

// edit store
router.put('/stores/:id', async (req: Request, res: Response) => {
    const store = await Store.findByPk(req.params.id);
    if (store) {
        await store.update(req.body);
        res.json(store);
    } else {
        res.status(404).send('Store not found');
    }
});

// delete store
router.delete('/stores/:id', async (req: Request, res: Response) => {
    const store = await Store.findByPk(req.params.id);
    if (store) {
        await store.destroy();
        res.status(204).send();
    } else {
        res.status(404).send('Store not found');
    }
});


//Bookstore ROUTES

// Sell a book in a store for a certain price
router.post('/bookstores', async (req: Request, res: Response) => {
    try {
        const bookstore = await BookStore.create(req.body);
        res.json(bookstore);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Get all books in a certain store
router.get('/bookstores/store/:id', async (req: Request, res: Response) => {
    const storeBooks = await Store.findAll({
        where: {
            id: req.params.id
        },
        include: [Book]
    });
    if (storeBooks) {
        res.json(storeBooks);
    } else {
        res.status(404).send('store not found');
    }
});


// Get the cheapest book available for each author in any store
router.get('/bookstores/author/:id', async (req: Request, res: Response) => {
    const authorBooks = await Author.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: Book,
        }],
    });
    let arrayOfBooksIds = []
    if (authorBooks) {
        if (authorBooks && authorBooks.books) {
            for (let i = 0; i < authorBooks.books.length; i++) {
                arrayOfBooksIds.push(authorBooks.books[i].id)
            }

            const cheapestBooks = await BookStore.findOne({
                where: {
                    bookId: {
                        [Op.in]: arrayOfBooksIds
                    }
                },
                attributes: ['storeId', 'bookId', 'price'],
                order: [['price', 'ASC']]
            });

            res.json(cheapestBooks);
        } else {
            res.status(404).send('Author doesnt have books');
        }
    } else {
        res.status(404).send('Author not found');
    }
});


// Get the cheapest book available for each author in any store
// By literal query is much easier in such complex join situations
router.get('/bookstores/authorQ/:id', async (req: Request, res: Response) => {
    const authorId = parseInt(req.params.id);
    const query = `
            SELECT
                authors.id AS authorId,
                authors.name AS authorName,
                books.id AS bookId,
                books.name AS bookName,
                MIN(bookstores.price) AS minPrice
            FROM authors
            INNER JOIN books ON authors.id = books.authorId
            INNER JOIN bookstores ON books.id = bookstores.bookId
            WHERE authors.id = :authorId
        `;

    const [results] = await sequelize.query(query, {
        replacements: { authorId }
    });

    if (results) {
        res.json(results)
    } else {
        res.status(404).send('Author not found');
    }
});

export default router;
