const path = require('path');
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const { dirname } = require('path');
const methodOverride = require('method-override');
const multer = require('multer');
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = 3001;
const SortMiddleware = require('./app/middlewares/SortMiddleware');
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

// Khai bao MiddleWare
// passport
const passport = require('passport');
const LoginFB = require('./app/middlewares/LoginFB');
const LoginLocal = require('./app/middlewares/LoginLocal');
const LoginGG = require('./app/middlewares/LoginGG');
const CheckUser = require('./app/middlewares/CheckUser');
const CheckRole = require('./app/middlewares/CheckRole');
const CheckInfo = require('./app/middlewares/CheckInfo');

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

// Custom middleware
// app.use(SortMiddleware);

// app.get('/courses', CheckUser);
// app.get('/courses/:slug', CheckUser);
// app.get('/me', CheckUser);
// // edit profile
// // app.get('/account/edit/:id', CheckInfo);
// // manager
// app.get('/manager/:slug', CheckUser, CheckRole);

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

// Template engine
app.engine(
    'hbs',
    exphbs({
        extname: '.hbs',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
        helpers: {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const sortType = field === sort.column ? sort.type : 'default';
                const icons = {
                    default: 'oi oi-elevator',
                    asc: 'oi oi-sort-ascending',
                    desc: 'oi oi-sort-descending',
                };
                const types = {
                    default: 'desc',
                    asc: 'desc',
                    desc: 'asc',
                };
                const icon = icons[sortType];
                const type = types[sortType];
                return `<a href="?_sort&column=${field}&type=${type}">
                    <span class="${icon}"></span>
                    </a>`;
            },
            topmenu: (username) => {
                var role = null;
                var name = null;
                var image = null;
                try {
                    var role = username.user.role;
                    var name = username.user.username;
                    var image = username.user.image;
                } catch {}
                if (role == 'admin') {
                    return `
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src="${image}" alt="" class="user-avatar">
                        <b>${name}</b>
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item text-danger" href="/manager/account">Quản lý tài khoản</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item text-danger" href="/manager/courses">Quản lý khóa học</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#infor">Thông tin tài khoản</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="/me/stored/courses">Khóa học của tôi</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" data-toggle="modal" data-target="#exampleModal" href="#">Đăng xuất</a>
                    </div>`;
                }
                if (role == 'user') {
                    return `
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src="${image}" alt="" class="user-avatar">
                        <b>${name}</b>
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#infor">Thông tin tài khoản</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="/me/stored/courses">Khóa học của tôi</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" data-toggle="modal" data-target="#exampleModal" href="#">Đăng xuất</a>
                    </div>`;
                } else {
                    return `<a class="nav-link ml-4" href="/account"><b>Đăng nhập</b></a>`;
                }
            },
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);

app.listen(port, () => {
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
