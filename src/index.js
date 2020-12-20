const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const Filter = require('bad-words')
const  { generateMessages, generateLocationMessages } = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))



io.on('connection',(socket)=>{
    console.log('New websocket connection')

    socket.on('join', ({ username, room },callback)=>{

        const {error , user} = addUser({ id : socket.id ,username, room})
        
        if(error){
            return callback(error)
        }


        socket.join(user.room)
      
        socket.emit('welcomeMessage', generateMessages('Chatbox',"Welcome to the chat box"))
        socket.broadcast.to(user.room).emit('welcomeMessage',generateMessages('Chatbox',`${user.username}  has joined`))
        io.to(user.room).emit('roomData',{
            room : user.room,
            users : getUsersInRoom(user.room)
        })
        
        callback()

    } )
    socket.on('message',(message,callback)=>{

        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
           return callback('Error : Message contains profanity')
        }
        io.to(user.room).emit('fromServer',generateMessages(user.username,message))
        callback()
    })

    socket.on('sendLocation',(location,callback)=>{

        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessages(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })

    socket.on('disconnect',()=>{

        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('fromServer',generateMessages('Chatbox',`${user.username} has left the chat`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users : getUsersInRoom(user.room)
            })
        }
        
    })
   

})

server.listen(port,()=>{
    console.log(`App running in ${port}`)
})