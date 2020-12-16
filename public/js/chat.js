const socket = io()

socket.on('welcomeMessage',(message)=>{
    console.log(message)
})
//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('#inputMessage')
const $messageFormSubmit = $messageForm.querySelector('#sendMessage')
const $locationForm = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $locations = document.querySelector('#locations')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


socket.on('fromServer', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message
    })
    
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage',(url)=>{
    const html = Mustache.render(locationTemplate,{
        url
    })

    $locations.insertAdjacentHTML('beforeend',html)
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