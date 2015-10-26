var socket = io();
var $input = $("#input")
var $username = $("#username")

$(document).ready(function() {
   $('#myModal').modal('show');
});

$('#myModal').on('shown.bs.modal', function () {
    $('#chooseName').focus();
})

$('#myModal').on('hidden.bs.modal', function () {
    $('#input').focus();
})

$("#submitName").click(function(){
  $username.val($("#chooseName").val());
  socket.emit('userJoin', $username.val());
  return true;
});



$("#send").click(function(){
  var msg = {username: $username.val(), body: $input.val()};
  socket.emit('message', msg);
  $('#input').val('');

  return false;
});

$("#input").keyup(function(event){
    if(event.keyCode == 13){
        $("#send").click();
    }
});


$("#chooseName").keyup(function(event){
    if(event.keyCode == 13){
        $("#submitName").click();
    }
});


socket.on('message', function(msg){
  window.scrollTo(0,document.body.scrollHeight);
  displayMessage(msg);
});

socket.on('userInfo', function(users){
  users.forEach(function (user) {
    addUserToOnlineList(user)
  })
});

socket.on('userJoin', function(msg){
  var username = sanitize(msg.name || "Anon")
  $('#messages').append(`<p><i>[${username} entered]</i></p>`);
  addUserToOnlineList(msg)
});

socket.on('userDisconnect', function(msg) {
  var id = msg.id.toLowerCase().trim();
  var item = $('#' +id)
  var username = sanitize(msg.name || "Anon")
  $('#messages').append(`<p><i>[${username} left]</i></p>`);
  item.remove();
});

function addUserToOnlineList(msg) {
  var username = sanitize(msg.name || "Anon")
  var id = msg.id.toLowerCase().trim();
  var time = msg.time;
  var user = `<li class="list-group-item" id="${id}"> ${username} joined ${time}</li>`;
  $('#userlist').append(user);
}

function sanitize(html){
  var html = html_sanitize(html);
  return html.autoLink();
}


function displayMessage(msg) {
  var name = msg.username || "Anon";
  var username = sanitize(name)
  var body = sanitize(msg.body);
  var time = msg.time;
  var message = `<div class="row">
    <div class="col-lg-7"><p><a href='#'>[${username}]</a>&nbsp; ${body}</p></div>
    <div class="col-lg-2 text-right">${time}</div>
  </div>`
  $('#messages').append(message);
}
