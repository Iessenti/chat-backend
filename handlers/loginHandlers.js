const e = require('cors')
const express = require('express')
const router = express.Router()
const jsonParser = express.json()
const fs = require('fs')
const { nanoid } = require('nanoid')

const dbPath = '../db/users.json'

router.post(
    '/auth',
    jsonParser,
    async (req, res) => {

        const { phone } = req.body

        fs.readFile(dbPath, (err, data) => {

            let arr = JSON.parse(data.body)

            arr.forEach( elem => {
                if (elem.phone === phone) {
                    return res.status(200).send({message: 'Пользователь существует'})
                }
            })

            let smsCode = Math.floor(1000 + Math.random() * 9000)

            return res.status(200).send({message: smsCode.toString(10)})
        } )
    }
)

router.post(
    '/checkSms',
    jsonParser,
    async (req, res) => {

        const { phone } = req.body
        const id = nanoid(12)

        fs.readFile(dbPath, (err, data) => {
            let arr = JSON.parse(data.body)
            arr.push({
                id: id,
                phone: phone,
                username: '',
                chats: [],
                active: false,
                currentAvatar: 0
            })
            fs.writeFile(dbPath, JSON.stringify(arr))

            return res.status(201).send({message: "Пользователь загружен", id: id})
        })

        
        
    }  
)

router.post(
    '/setUsername',
    jsonParser,
    async (req, res) => {

        const { username, id, currentAvatar } = req.body

        fs.readFile(dbPath, (err, data) => {

            let arr = JSON.parse(data.body)

            const newArr = arr.map( elem => {
                if (elem.username === username) {
                    return res.send({message: "Пользователь с таким именем уже существует"})
                } else if (elem.id === id) {
                    return {...elem, username: username, currentAvatar: currentAvatar, active: true}
                } else {
                    return elem
                }
            })

            fs.writeFile(dbPath, JSON.stringify(newArr))

            return res.status(201).send({message: "Данные пользователя обновлены", id: id})
        })



    }
)


router.post(
    '/login',
    jsonParser,
    async (req, res) => {

        const {phone} = req.body
        let smsCode = Math.floor(1000 + Math.random() * 9000)

        fs.readFile(dbPath, (err,data) => {
            let arr = JSON.parse(data.body)
            let person = 0
            let newArr = arr.map( elem => {
                if (elem.phone === phone) {
                    person = elem
                    return {...elem, active: true}
                } else {
                    return elem
                }
            })
            if (state != 0) {
                fs.writeFile(dbPath, JSON.stringify(newArr))
                return res.send({message: "Введите код", sms: smsCode, person: person})
            } else {
                return res.send({message: "Такой пользователь не существует"})
            }
            
        })

    }
)


router.post(
    '/getAllUsers',
    jsonParser,
    async (req, res) => {

        fs.readFile(dbPath, (err, data) => {
            res.send({body: data})
        })

    }
)

module.exports = router;