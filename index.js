console.log('started server');
const io = require('socket.io')(8000,{
    cors:{
        origin:"http://127.0.0.1:5500",
        methods:["GET","POST"]
    }
});

const users = {};

io.on('connection',socket =>{
    socket.on('new-user-joined',name=>{
        socket.emit('user-joined-btn',users,name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name,socket.id);
    });

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message : message , name : users[socket.id]});
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('user-left',users[socket.id],socket.id);
        delete users[socket.id];
    });
});