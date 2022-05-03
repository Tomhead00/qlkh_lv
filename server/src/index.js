const path = require('path');
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const { dirname } = require('path');
const methodOverride = require('method-override');
const multer = require('multer');
require('dotenv').config();
const app = express();
const port = 3001;
const route = require('./routes');
const db = require('./config/db');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const https = require("https");
const http = require('http');
const fs = require("fs");
const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
};
const randomstring = require("randomstring");

const server = require('http').createServer(app);
const cors = require('cors')
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Khai bao MiddleWare
// passport
const passport = require('passport');
const LoginFB = require('./app/middlewares/LoginFB');
const LoginLocal = require('./app/middlewares/LoginLocal');
const LoginGG = require('./app/middlewares/LoginGG');

// connect to DB
db.connect();

// use static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'resources/js')));

app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(bodyParser.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))

app.use(methodOverride('_method'));

// connect mongodb session
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/QLKH',
    collection: 'mySessions',
    expiresKey: `_ts`,
    expiresAfterSeconds: 60 * 60 * 24 * 14,
});

// cookie session
app.use(session({
        cookie: {
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24 , // 1 day
        },
        secret: 'keyboardcat',
        resave: true,
        saveUninitialized: true,
        store: store,
    }),
);
app.use(cookieParser("keyboardcat"))

// passport fb
passport.use(LoginFB);
// passport local
passport.use(LoginLocal);
// passport gg
passport.use(LoginGG);
// Lưu session
passport.serializeUser(function (user, done) {
    return done(null, user);
});
passport.deserializeUser(function (user, done) {
    return done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());

// Middleware facebook
app.get(
    '/auth/facebook/',
    passport.authenticate('facebook', { scope: 'email' }),
);
app.get('/auth/facebook/callback', function (req, res, next) {
    passport.authenticate('facebook', function (err, user, info) {
        if (err) {
            next(err);
            return res.redirect(`${process.env.REACT_URL}/account`);
        }

        if (!user || info.reason == 'blocked') {
            // console.log(info.reason + "asd");
            return res.redirect(`${process.env.REACT_URL}/account`);
        }
        req.logIn(user, function (err) {
            // console.log(info.message + "Asw");
            if (err) {
                return next(err);
            }
            return res.redirect(`${process.env.REACT_URL}/courses`);
        });
    })(req, res, next);
});

// Middleware gg
app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
    }),
);
app.get('/auth/google/callback', function (req, res, next) {
    passport.authenticate('google', function (err, user, info) {
        if (err) {
            next(err);
            return res.redirect(`${process.env.REACT_URL}/account#_=_`);
        }
        if (!user || info.reason == 'blocked') {
            return res.redirect(`${process.env.REACT_URL}/account#_=_`);
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect(`${process.env.REACT_URL}/courses`);
        });
    })(req, res, next);
});

// Middleware Local
app.post('/account/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            next(err);
            return res.redirect('/account');
        }
        if (!user) {
            return res.send(info.message);
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send('/courses');
        });
    })(req, res, next);
});

// upload image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img/user');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});
var upload = multer({ storage: storage });
app.put('/account/edit/:id/', upload.single('myFile'));

// HTTP log
// app.use(morgan('combined'));

app.set('views', path.join(__dirname, 'resources', 'views'));
route(app);

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
    let broadcaster;
    socket.on("broadcaster", () => {
        // console.log("start live: " + socket.id);
        socket.emit("getID", socket.id)
    });
    socket.on("infor", (id, name, description) => {
        // console.log(id, name, description);
        socket.to(id).emit("infor", name, description);
    });
    socket.on("watcher", (idSocket, newUser) => {
        // console.log("watcher");
        broadcaster = idSocket
        socket.to(idSocket).emit("watcher", socket.id);
        socket.to(idSocket).emit("joinLive", newUser);
    });
    socket.on("offer", (id, message) => {
        // console.log("offer", socket.id);
        socket.to(id).emit("offer", socket.id, message);
    });
    socket.on("answer", (id, message) => {
        // console.log("answer", socket.id);
        socket.to(id).emit("answer", socket.id, message);
    });
    socket.on("candidate", (id, message) => {
        // console.log("candidate", socket.id);
        socket.to(id).emit("candidate", socket.id, message);
    });

    socket.on("disconnect", () => {
        // console.log("disconnect", socket.id);
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });
    socket.on("mess", (id, newMessage, listUser) => {
        listUser.map((element) => {
            socket.to(element.socketID).emit("mess", id, newMessage);
        })
    });

    socket.on("joinLive", (listUsers, listBans) => {
        try {
            listUsers.map((element) => {
                socket.to(element.socketID).emit("joinLive", listUsers, listBans);
            })
            socket.emit("joinLiveRefeshList", listUsers, listBans)
        } catch(err) {}
    });

    socket.on("banAllToBroatcaster", (checked) => {
        socket.emit("banAllToBroatcaster", checked);
    });

    socket.on("ban1User", (userID) => {
        socket.emit("ban1User", userID);
    });

    socket.on("banChat", (id, checked) => {
        socket.to(id).emit("banChat", checked);
    });
});

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

// Creating https server by passing
// options and app object
// https.createServer(options, app)
// .listen(port, function (req, res) {
//     console.log(`App listening at https://localhost:${port}`);
// });
// http.createServer(app).listen(port, function (req, res) {
// console.log(`App listening at https://localhost:${port}`)});
