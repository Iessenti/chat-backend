// const { nanoid } = require('nanoid')

// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')

// const adapter = new FileSync('db/messages.json')

// module.exports = (io, socket) => {
//     const getMessages = () => {

//         io.in(socket.roomId).emit('messages', messages)
//     }

//     const addMessage = (message) => {
//         db.get('messages')
//             .push({
//                 messageId: nanoid(8),
//                 createdAt: new Date(),
//                 ...message
//             })
//             .write()

//         getMessages()
//     }

//     socket.on('message:get', getMessages)
//     socket.on('messages:add', addMessage)
// }