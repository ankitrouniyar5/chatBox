const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

let message = "Welcome to the chat box"

io.on('connection',(socket)=>{
    console.log('New websocket connection')
    socket.emit('welcomeMessage', message)
    socket.broadcast.emit('welcomeMessage','A new user has joined')

    socket.on('message',(message,callback)=>{

        const filter = new Filter()

        if(filter.isProfane(message)){
           return callback('Error : Message contains profanity')
        }
        socket.broadcast.emit('fromServer',message)
        callback()
    })

    socket.on('sendLocation',(location,callback)=>{
        io.emit('locationMessage',`https://google.com/maps?q=${location.latitude},${location.longitude}`)
        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('fromServer','A user has left the chat')
    })
   
})

server.listen(port,()=>{
    console.log(`App running in ${port}`)
})