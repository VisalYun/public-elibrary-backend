const express = require('express')
const cors = require('cors')
const session = require('express-session');
const redis = require('redis')
const connectRedis = require('connect-redis')
const passport = require('passport');
const multer = require('multer')
const genPassword = require('./lib/passwordUtil').genPassword;
const { sequelize, Book, Chapters, User } = require('./models')

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

/* ------------------ Session Config ------------------ */
const RedisStore = connectRedis(session)
//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})
redisClient.on('error', err => {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', err => {
    console.log('Connected to redis successfully');
});

//Configure session middleware
app.use(session({
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({ client: redisClient }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}))

/* ------------------ Passport Config ------------------ */
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
})

/* ------------------ Auth route ------------------ */
app.post("/register", async(req, res) => {
    const { username, password } = req.body
    
    const saltHash = genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    
    await User.findOne({where: {username}})
        .then(async user => {
            if(user) { return res.json("Username is already taken") }

            try {
                const user = await User.create({ username, salt, hash })
                return res.json(user)
            } catch (e) {
                console.log(e)
                return res.status(500).json(e)
            }
        })
        .catch((e) => {
            console.log(e)
            return res.status(500).json(e)
        });
})

app.post("/login", passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        return res.json("Logout success!")
    });
});

app.get("/login-success", (req, res) => {
    return res.json("Login successful")
})

app.get("/login-failure", (req, res) => {
    return res.json("Login fail! Please check your login credential again")
})

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource' });
    }
}

/* ------------------ Book Route ------------------ */
app.post("/book", upload.single('book_file'), async(req, res) => {
    const { title, author, published_date, description, thumbnail_url } = req.body
    console.log(req.file)
    const book_file = req.file.path

    try{
        const book = await Book.create({ title, author, published_date, description, thumbnail_url, book_file })
        return res.json(book)
    }catch(e){
        console.log(e)
        return res.status(500).json(e)
    }
})

app.get("/book", isAuth, async (req, res) => {
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