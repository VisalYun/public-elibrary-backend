const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { sequelize, Book, Chapters } = require('./models')

const app = express()
app.use(express.json())

app.use(cors())

/* ------------------ File Upload Config ------------------ */
app.use('/uploads', express.static('uploads'))
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

/* ------------------ Book Route ------------------ */
app.post("/book", upload.single('book_file'), async(req, res) => {
    const { title, author, published_date, description, donator, donator_phone_number } = req.body
    console.log(req.file)
    const book_file = req.file.path

    try{
        const book = await Book.create({ title, author, published_date, description, book_file, donator, donator_phone_number })
        return res.json(book)
    }catch(e){
        console.log(e)
        return res.status(500).json(e)
    }
})

app.get("/book", async (req, res) => {
    try {
        const book = await Book.findAll()
        return res.json(book)
    } catch (e) {
        console.log(e)
        return res.status(500).json( 'Something went wrong!' )
    }
})

app.get("/book/:id", async (req, res) => {
    const book_id = req.params.id

    try {
        const book = await Book.findOne({ where: {book_id} })
        return res.json(book)
    } catch (e) {
        console.log(e)
        return res.status(500).json('Something went wrong!')
    }
})

app.post("/chapter", async (req, res) => {
    const { chapter_name, start_page, end_page, book_id } = req.body

    try {
        const book = await Book.findOne({ where: { book_id: book_id } })
        const chapter = await Chapters.create({ chapter_name, start_page, end_page, bookId: book.book_id })
        return res.json(chapter)
    } catch (e) {
        console.log(e)
        return res.status(500).json(e)
    }
})

app.get("/chapter/:id", async (req, res) => {
    const bookId = req.params.id

    try {
        const chapter = await Chapters.findAll({ where: { bookId }, order: [ ['chapter_id', 'ASC'] ] })
        return res.json(chapter)
    } catch (e) {
        console.log(e)
        return res.status(500).json('Something went wrong!')
    }
})

app.listen({ port: 5000 }, async() => {
    console.log("Server is running on port 5000")
    await sequelize.authenticate()
    console.log("Database connected!")
})