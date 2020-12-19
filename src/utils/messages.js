const generateMessages = (text)=>{
    return {
        text,
        createdAt : new Date().getTime() //to get the time stamp
    }
}

const generateLocationMessages = (text)=>{
    return{
        text,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMessages,
    generateLocationMessages
}