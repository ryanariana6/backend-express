const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const db = require('./config/Database.js');
const SequelizeStore = require('connect-session-sequelize');
const AdminRoute = require('./routes/AdminRoute.js');
const NewRoute = require('./routes/NewRoute.js');
const AboutRoute = require('./routes/AboutRoute.js');
const ServiceRoute = require('./routes/LayananRoute.js');
const HeroRoute = require('./routes/HeroRoute.js');
const AuthRoute = require('./routes/AuthRoute.js');
const serverless = require('serverless-http');
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

app.on("error", function () {
    console.log(arguments)
});

// (async () => {
//     await db.sync();
// })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie:{
        secure: 'auto'
    }
}))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(express.static("public"));
app.use(fileUpload());
app.use(AdminRoute);
app.use(NewRoute);
app.use(AboutRoute);
app.use(ServiceRoute);
app.use(HeroRoute);
// app.use(AuthRoute);

/* final catch-all route to index.html defined last */
app.get('/*', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
})

// store.sync();

app.listen(process.env.APP_PORT,()=>{
    console.log("server BACKEND up and running...");
});
module.exports.handler = serverless(app);