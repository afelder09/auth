// Main starting point for my application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const router = require('./router');

// DB setup
mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true });

// App Setup
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*'}));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on ', port);