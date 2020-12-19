const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const Filter = require('bad-words')
const  { generateMessages, generateLocationMessages } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

let message = "Welcome to the chat box"

io.on('connection',(socket)=>{
    console.log('New websocket connection')
    socket.emit('welcomeMessage', generateMessages(message))
    socket.broadcast.emit('welcomeMessage',generateMessages('A new user has joined'))

    socket.on('message',(message,callback)=>{

        const filter = new Filter()

        if(filter.isProfane(message)){
           return callback('Error : Message contains profanity')
        }
        socket.broadcast.emit('fromServer',generateMessages(message))
        callback()
    })

    socket.on('sendLocation',(location,callback)=>{
        io.emit('locationMessage',generateLocationMessages(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('fromServer',generateMessages('A user has left the chat'))
    })
   
})

server.listen(port,()=>{
    console.log(`App running in ${port}`)
})