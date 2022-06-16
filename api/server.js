require('./config/env.js');
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const db = require('./db/db.js');
const routes = require('./db/routes/routes.js');
const passportConfig = require('./config/passport.js');

const app = express();

(async function() {
    try {
        await db.authenticate();
        console.log('--- Database connected... ---');
    } catch (error) {
        console.error('--- Database connection error: ---', error);
    }
})();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false
});

passportConfig(passport);
app.use(passport.initialize());

app.use(cors({
    origin: 'https://origami.networkmanager.pl/'
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(limiter);
app.use('/api', routes);

app.listen(5000, () => console.log('--- Express server is running... ---'));
