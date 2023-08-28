import './config/env.js';
import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import Database from './db/database.js';
import routes from './db/routes/routes.js';
import passportConfig from './config/passport.js';

const app = express();

(async function() {
    try {
        await Database.authenticate();
        console.log('--- Database connected... ---');
    } catch (error) {
        console.error('--- Database connection error: ---', error);
    }
})();

const limiter = rateLimit({
    windowMs: 60 * 1000,
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
