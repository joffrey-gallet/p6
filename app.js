const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
require('dotenv').config();


//import routes
const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user');

mongoose.set('strictQuery', true);

//connect to mongodb
mongoose.connect(process.env.URL_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log(error));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

//use routers
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));


module.exports = app;