const socket = io()


//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('#inputMessage')
const $messageFormSubmit = $messageForm.querySelector('#sendMessage')
const $locationForm = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $locations = document.querySelector('#locations')
const $sideBar = document.querySelector("#sideBar")

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML 

//options

const {username , room }= Qs.parse(location.search,{ ignoreQueryPrefix : true})


const autoScroll = ()=>{

    //new msg elment
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    // message container height

    const containerHeight = $messages.scrollHeight

    // how far is scrolled
    const scrollOffset = $messages.scrollTop  + visibleHeight
    if(containerHeight - newMessageHeight <= scrollOffset ){
        $messages.scrollTop = $messages.scrollHeight
    }
    
}

socket.on('welcomeMessage',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm A')

    })
    
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('fromServer', (message) => {
    
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm A')
    })
    
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})


socket.on('locationMessage',(url)=>{
    const html = Mustache.render(locationTemplate,{
        username : url.username,
        url : url.text,
        createdAt  : moment(url.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('roomData',({room,users})=>{
  
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    $sideBar.innerHTML = html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormSubmit.setAttribute('disabled','disabled')
    const msgContent = e.target.elements.inputMessage.value

    socket.emit('message',msgContent,(error)=>{
        
        $messageFormSubmit.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        
        console.log('The message was delivered ')
    })

})


$locationForm.addEventListener('click',()=>{

    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    $locationForm.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        const location = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }
        socket.emit('sendLocation',location,()=>{
            $locationForm.removeAttribute('disabled')
            console.log("Location was shared with others")
        })
    })
    
    

})

socket.emit('join',{ username, room },(error)=>{
    if(error){
        alert(error)
        location.href = "/"
    }

})