const express = require('express');
// const parser = require('body-parser');  removing for deployment
// const morgan = require('morgan'); removing for deployment
const path = require('path');
// const axios = require('axios');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = 3000;
const { getQuote } = require('./database/dbHelpers')

server.listen(PORT, () => console.log('listening on port ' + PORT + ', fellas'));

// app.use(morgan('dev')); removing for deployment
// app.use(parser.json()); removing for deployment
// app.use(parser.urlencoded({ extended: true }));  removing for deployment
app.use(express.static(path.join(__dirname + '/../TWF_Client/client/dist/')));

let players = [];
let gameInProgress = false;
let prompt = '';

io.on('connection', (socket) => {
  console.log('new typer joined:', socket.id)

  //emit state of the game on join
  socket.emit('welcome', { gameInProgress, prompt, players })

  //listen for joining the room 
  socket.on('joinRoom', (room) => {
    socket.join(room);
    return socket.emit('joinSuccess', 'You\'ve joined ' + room);
  })

  //listen for incoming chat
  socket.on('chat', (data) => {
    //send chat data to clients
    io.sockets.emit('chat', data);
  });

  // Handle typing event
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  // listen for progress  
  socket.on('progress', (data) => {
    let found = false;
    for (let i = 0; i < players.length; i++) {
      if (players[i].username === data.username) {
        players[i].progress = data.progress;
        found = true;
      }
    }
    if (!found) {
      players.push(data);
    }
    io.sockets.emit('progress', players);
  });

  socket.on('joinGame', (username) => {
    players.push({
      username,
      progress: 0
    });
    if (players.length >= 4) {
      io.sockets.emit('gameStart', 'Game is about to start! Getting prompt...')
    }
  })

  socket.on('gameStart', () => {
    let id = Math.floor(Math.random() * 77) + 1;
    getQuote(id, (err, data) => {
      if (err) {
        console.log('error getting prompt: ', err);
      } else {
        prompt = data[0].dataValues.quote;
        gameInProgress = true;
        io.sockets.emit('prompt', prompt);
        io.sockets.emit('gameStartedAll', 'Game has started!');
        io.sockets.emit('gameInProgress', gameInProgress);
      }
    })
  })

  socket.on('gameOver', (username) => {
    players = [];
    gameInProgress = false;
    io.sockets.emit('gameOver', username);
    io.sockets.emit('gameInProgress', gameInProgress);
  })

})
