const express = require('express'),
  fs = require('fs'),
  path = require('path'),
  https = require('https'),
  helmet = require('helmet'),
  socket = require('socket.io'),
  dotenv = require('dotenv'),
  jwt = require('jsonwebtoken'),
  body = require('body-parser');
(randomstring = require('randomstring')),
(cookie = require('cookie-parser')),
(ss = require('socket.io-stream')),
(redis = require('socket.io-redis')),
(cors = require('cors'));
const verifly = require('./router/verfily');
const port = process.env.PORT || 3000;
const app = express();

const jwtExpirySeconds = 300;
// config file
dotenv.config();

// set app
app.use(cookie());
app.use(helmet());
app.use(cors());
app.use(body.json());
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
  express.urlencoded({
    extended: true,
  })
);

// gobal var
const rooms = {};
const list_name = [];
let count = 0,
  users = 0;
let roomname = [];
let rr = {};

//static file
app.use(express.static('public'));

// listers
const server = app.listen(port, () => {
  console.log("i'm good boy");
});

// socket
const io = socket(server);

// router

// index of the page
app.get('/', (req, res) => {
  let some_data = randomstring.generate({
    length: 9,
  });
  const token = jwt.sign({
      username: some_data,
    },
    process.env.TOKEN, {
      algorithm: 'HS256',
      expiresIn: jwtExpirySeconds,
    }
  );
  res.cookie('token', token, {
    maxAge: jwtExpirySeconds * 100,
  });
  res.render('index', {
    rooms: rooms,
  });
  res.end();
});

// redirect room
app.get('/:room', verifly, (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/');
  }
  res.render('room', {
    roomName: req.params.room,
  });
});

// create room
app.post('/create', (req, res) => {
  if (rooms[req.body.create] != null) return res.redirect('/');

  rooms[req.body.create] = {
    users: {},
    keys: {
      key: randomstring.generate({
        length: 34
      }),
      name: randomstring.generate({
        length: 34
      }),
      password: randomstring.generate({
        length: 34
      }),
    },
  };
  res.redirect(req.body.create);

  // send the room details
  io.emit('new-room', req.body.create);
});

// while socket is on
io.on('connection', function (socket) {
  let time = new Date();
  let ch = time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });
  console.log(`socket made connection ${count++} and ${ch}`);

  // this for chat
  socket.on('chat', function (data) {
    io.sockets.to(data.room).emit('chat', data);
  });
  socket.on('user_file', function (data) {
    io.sockets.to(data.room).emit('user_file', data);
  });

  // ss(socket).on('file', function (stream, data) {
  //   console.log(data)
  //   console.log(stream)
  //   // var filename = path.basename(data.name);
  //   // stream.pipe(fs.createWriteStream(filename));
  // });

  socket.on('set_password', function (data) {
    roomname.push(data.room);
    rr[data.room] = {
      status: data.state,
      set_password: data.password,
      who_set: data.handle,
      roomname: data.room,
      checkbox: data.check,
    };
    io.sockets.to(data.room).emit('set_password', rr);
  });

  // this for no of connection
  io.emit('count', users);

  //this for name
  socket.on('list', (data) => {
    if (list_name.indexOf(data.handle) == -1) {
      list_name.push(data.handle);
      io.emit('count', users++);
      socket.join(data.room);
      rooms[data.room].users[socket.id] = data.handle;
      io.sockets.to(data.room).emit('list_of_user', rooms[data.room].users);
      socket.broadcast.to(data.room).emit('new-user', data.handle);
      io.sockets.to(data.room).emit('data_keys', rooms[data.room].keys);
      roomname.map(lo_room);
      // mapping function
      function lo_room(value) {
        io.sockets.to(value).emit('status', rr);
      }
    } else {
      socket.emit('err_name', {
        message: 'User name is already taken',
      });
    }
  });

  socket.on('delete', (data) => {
    socket.to(data.room).broadcast.emit('delete', data.id);
  });

  // lister

  socket.on('typing', (data) => {
    socket.to(data.room).broadcast.emit('typing', data.handle);
  });

  socket.on('disconnect', () => {
    getUserRoom(socket).forEach((room) => {
      const index = list_name.indexOf(rooms[room].users[socket.id]);
      if (index > -1) {
        list_name.splice(index, 1);
      }
      Object.keys(rr).forEach((key, index) => {
        if (rr[key].who_set == rooms[room].users[socket.id]) {
          let tempRooom = rr[key].roomname;
          rr[key] = {};
          rr[key] = {
            status: false,
            set_password: '',
            who_set: 'none',
            checkbox: false,
          };
          io.sockets.to(tempRooom).emit('status', rr);
          io.sockets.to(tempRooom).emit('err_name', {
            message: 'Sorry admin left the chat room',
          });
          io.sockets.to(tempRooom).emit('set_password', rr);
          const index = roomname.indexOf(tempRooom);
          if (index > -1) {
            roomname.splice(index, 1);
          }
        }
      });
      socket
        .to(room)
        .broadcast.emit('user-disconnect', rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
      io.sockets.to(room).emit('list_of_user', rooms[room].users);
      io.emit('count', users--);
    });
  });
});

function getUserRoom(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}