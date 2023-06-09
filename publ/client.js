const socket = io("http://localhost:8000");

const form = document.getElementById('send-form');
const message_input = document.getElementById('sending');
const online_user = document.querySelector('.online-users-btn');
const message_container = document.querySelector('.container');
const adding = (message,message_type)=>{
    const message_ele = document.createElement('div');
    message_ele.innerHTML = message;
    message_ele.classList.add('message');
    message_ele.classList.add(message_type);
    message_container.append(message_ele);
}

const btnadd = (name,sid)=>{
    const butn = document.createElement('button');
    butn.classList.add('onlin-btn');
    butn.id = sid;
    butn.innerHTML=name;
    online_user.append(butn);
}

const btndel = (sid)=>{
    const btdis = document.getElementById(`${sid}`);
    btdis.remove();
}

const nam = prompt("enter your name");
socket.emit('new-user-joined',nam);

socket.on('user-joined-btn',(users,name)=>{
    message_input.placeholder=`${name} sending`;
    for(const key in users){
        const butn = document.createElement('button');
        butn.id = key;
        butn.classList.add('onlin-btn');
        butn.innerHTML=users[key];
        online_user.append(butn);
    }
});

socket.on('user-joined',(name,sid)=>{
    btnadd(name,sid);
    adding(`<em>${name}</em> joined the chat!!!!`,'receive');
});

socket.on('user-left',(name,sid)=>{
    adding(`${name} left the chat!!!!`,'receive');
    btndel(sid);
});
socket.on('receive',data =>{
    adding(`${data.name} : ${data.message}`,'receive');
});

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const mesage = message_input.value;
    adding(`You: ${mesage}`,'send');
    message_input.value="";
    socket.emit('send',mesage);
});