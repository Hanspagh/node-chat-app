var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
app.use(express.static('public'));
var format = "YYYY-MM-DD H:mm:ss"
var users = [];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  var userlist = [];
  for (var key in users) {
    var user = users[key];
    userlist.push({id: key, name: user.name, time: user.time.startOf('minut').fromNow()});
  }

  socket.emit('userInfo', userlist);

  socket.on('userJoin', function(name){
    var time = moment();
    users[socket.id] = {name: name, time: time};
    io.emit('userJoin', {name: name, id: socket.id, time: time.startOf('second').fromNow()});
  });

  socket.on('message', function(msg){
    msg.time = timeFormat(moment());
    io.emit('message', msg);
  });

  socket.on('disconnect', function(){
    if(users[socket.id] !== undefined) {
      io.emit('userDisconnect', {name: users[socket.id].name, id: socket.id});
      delete users[socket.id];
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function timeFormat(time) {
  return time.format(format)
}
