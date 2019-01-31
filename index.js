const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = 3000;

server.listen(PORT, () => console.log('listening on port ' + PORT + ', fellas'));

app.use(morgan('dev'));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
//todo: input correct directory for indexhtml
app.use(express.static(path.join(__dirname + '/../client/dist/')));

io.on('connection', (socket) => {
  console.log('new typer joined:', socket.id)

  socket.emit('welcome', 'Welcome to Type with Friends!')

  //listen for joining the room 
  socket.on('joinRoom', (room) => {
    socket.join(room);
    return socket.emit('joinSuccess', 'You\'ve joined the ' + room);
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

})