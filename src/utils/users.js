const users = []

//addUsers 

const addUser = ({id , username ,room })=>{

    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error : "User name and room are required"
        }
    }

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existingUser){
        return { 
            error :  "User name is in use"
        }
    }

    const user = {id , username , room}
    users.push(user)

    return {user}

}

//removeUsers
const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)

    if (index !=-1){
        return users.splice(index,1)[0]
    }
}

//getUser

const getUser = (id)=>{

    const user = users.find((user)=>{
        return user.id === id
    }) 

    return user
}

//getUsersInRoom

const getUsersInRoom = (room)=>{
    const usersInRoom = users.filter((user)=>{
        return user.room === room
    })

    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom

}