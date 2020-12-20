const generateMessages = (username, text)=>{
    return {
        username,
        text,
        createdAt : new Date().getTime() //to get the time stamp
    }
}

const generateLocationMessages = (username, text)=>{
    return{
        username,
        text,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMessages,
    generateLocationMessages
}