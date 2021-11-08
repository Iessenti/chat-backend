
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})
const fs = require('fs')
const cors = require('cors')
const messageHandlers = require('./handlers/messageHandlers')

const dbPath = '../db/message.json'
app.use(cors({
    origin: '*'
}));
app.use('/api/', require('./handlers/loginHandlers'))

const onConnection = (socket) => {

    console.log('User connected')

    socket.join('mainRoom')

    let newArr = []
    fs.readFile(dbPath, (err,data) => {
        let arr = JSON.parse(data.body)
        newArr = arr.map (elem => {
            if ( (elem.from === socket.handshake.from.id) || (elem.from === socket.handshake.from.id) ) {   
                return elem
            }
        })
    })

    socket.emit("opened", {id: socket.handshake.from.id, messages: newArr})

    socket.on('message', (messageData) => {
        console.log(messageData)
        fs.readFile(dbPath, (err,data) => {
            if (err) {
                return console.log(err)
            }
            let arr = JSON.parse(data.body)
            arr.shift(messageData)
            fs.writeFile(dbPath, JSON.stringify(arr))
            socket.emit("sendedMessage", messageData)
        })
    })

    socket.on('disconnect', () => {
        console.log('User disconnected!')
        socket.leave(roomId)
    })
}

io.on('connection', onConnection)

const port = 5000
app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})
