const express = require('express');

const app = express();

app.use((request, response, next) => {
    console.log();
    next();
});
app.use((reqest, response, next) => {
    response.json({ message: 'Request is ok !' });
});

module.exports = app;