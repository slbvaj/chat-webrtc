const io = require('socket.io')(3000)

const users = {}

dumpUsers()

/*Every time someone connects send a hello world message */
io.on('connection', socket => {
    
    //console.log("connection attempted - emiting hello world")
    //socket.emit('chat-message', 'Hello World ')
    //console.log(" Hello World message sent")

    socket.on('send-chat-message', message => {
        console.log("recieved message: "+message)
        //socket.emit('chat-message',message); // send the message out to just this connection (be careful here - this would be wrong)
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]} ); // send the message out to ALL connections
    })
    
    socket.on('connect-user', name => {
        console.log("user connected: "+name)
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name)
        dumpUsers()
    })
    
    socket.on('disconnect', () => {
       if(socket.id)  {
            let name = users[socket.id]
            console.log("user disconnected: "+name)
            delete users[socket.id];
            socket.broadcast.emit('user-disconnected', name)
            dumpUsers()
        }
    })

})

function dumpUsers() {
    console.log(`# of users connected: ${Object.keys(users).length}`)
    console.log(users)
}

