const socket = io.connect('/');

const form = document.getElementById('send-container');

const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".chatbox");

const append = (message,position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

form.addEventListener('submit',(e) =>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})

const Name = sessionStorage.getItem('name');
socket.emit('new-user-joined',Name);

socket.on('user-joined',name =>{
    append(`${name} joined the chat`,'right');
})

socket.on('recieve',data =>{
    append(`${data.name}:${data.message}`,'left');
})

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
  });