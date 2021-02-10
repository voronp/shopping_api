require('dotenv').config({ path: '.env' });
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');

if(process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    );

    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', (err) => {
        console.error(`Database Connection Error → ${err.message}`);
    });
}

const indexRouter = require('./routes/index');
const shoppingListsRouter = require('./routes/shoppingLists');
const shoppingListItemsRouter = require('./routes/shoppingListItems');
const {useAuth} = require('./auth')
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(useAuth())
app.use('/', indexRouter);
app.use('/shopping-list', shoppingListsRouter);
app.use('/shopping-list-item', shoppingListItemsRouter);

module.exports = app;
