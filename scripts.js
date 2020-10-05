// Client side scripts for webrtc
console.log("trying to load socket.io")
const socket = io('http://localhost:3000')

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
console.log('Registering new user: '+name)
socket.emit('connect-user',name)


// Register so you can see when OTHER users connect
socket.on('user-connected', name => {
    appendMessage(`[${name} connected]`)
 })

 // Register so you can see when OTHER users disconnect
socket.on('user-disconnected', name => {
    appendMessage(name,'disconnected')
//    appendMessage(`[${name} disconnected]`)
 })
 
 // Register for OTHER  users's chat messages
socket.on('chat-message', data => {
    console.log('Recived message: ',data)
    appendMessage(`${data.name}: ${data.message}`)
})
console.log("done loading")

// Register event listener on the form to send the text on the socket
messageForm.addEventListener('submit', e=> {
    e.preventDefault() // Don't submit the form to the server
    const message = messageInput.value; // get the message the user typed so we can send it
    appendMessage(`You: ${message}`) // make sure to show it on the screen
    console.log('Sending message from the client to the server: '+message)
    socket.emit('send-chat-message', message) //send the message
    console.log('Message sent from the client to the server')
    messageInput.value = '' // blank out the input - get it ready for the next thing the user wants to type

})

function appendMessage(who, message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = `${who}: ${message}`
    messageContainer.append(messageElement)
}