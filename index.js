const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = 3000;

server.listen(PORT, () => console.log('listening on port ' + PORT + ', fellas'));

app.use(morgan('dev'));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/../TWF_Client/client/dist/')));

// app.get('/api/prompt', (req, res) => {
//   axios.get('https://opinionated-quotes-api.gigalixirapp.com/v1/quotes/')
//   .then((data) => {
//     console.log('data here', data.data)
//     res.status(200).send(data.data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// })

let players = [];

io.on('connection', (socket) => {
  console.log('new typer joined:', socket.id)

  socket.emit('welcome', 'Welcome to Type with Friends!')

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

  // socket.on('prompt', () => {
  //   axios.get('https://opinionated-quotes-api.gigalixirapp.com/v1/quotes/')
  //   .then((data) => {
  //     io.sockets.emit('prompt', data.data);
  //   })
  //   .catch((error) => {
  //     console.log('error getting prompt: ', error);
  //   });
  // })

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
    axios.get('https://opinionated-quotes-api.gigalixirapp.com/v1/quotes/')
    .then((data) => {
      io.sockets.emit('prompt', data.data);
      io.sockets.emit('gameStartedAll', 'Game has started!');
      io.to('players').emit('gameStartedPlayers', 'Start typing!');
    })
    .catch((error) => {
      console.log('error getting prompt: ', error);
    })
  })

})
