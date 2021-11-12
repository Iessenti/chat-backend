const e = require('cors')
const express = require('express')
const router = express.Router()
const jsonParser = express.json()
const fs = require('fs')
const { nanoid } = require('nanoid')

cosnt path = require("path")
const dbPath = '../db/users.json'

router.post(
    '/auth',
    jsonParser,
    async (req, res) => {

        const { phone } = req.body
        console.log(phone)
        fs.readFile(path.resolve(__dirname, dbPath), (err, data) => {

            let arr = JSON.parse(data)

            arr.body.forEach( elem => {
                if (elem.phone === phone) {
                    return res.status(200).send({message: 'Пользователь существует'})
                }
            })

            let smsCode = Math.floor(1000 + Math.random() * 9000)
            console.log(smsCode)
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
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
        console.log('check')
        fs.readFile(path.resolve(__dirname, dbPath), (err, data) => {
            let arr = JSON.parse(data)
            
            arr.body.push({
                id: id,
                phone: phone,
                username: '',
                chats: [],
                active: false,
                currentAvatar: 0
            })
            fs.writeFile(path.resolve(__dirname, dbPath), JSON.stringify({body: arr.body}), () => {})
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            return res.status(201).send({message: "Пользователь загружен", id: id})
        })

        
        
    }  
)

router.post(
    '/setUsername',
    jsonParser,
    async (req, res) => {

        const { username, id, currentAvatar } = req.body
        console.log(username+ '   ' + id)
        fs.readFile(path.resolve(__dirname, dbPath), (err, data) => {

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

            fs.writeFile(path.resolve(__dirname, dbPath), JSON.stringify(newArr))
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
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

        fs.readFile(path.resolve(__dirname, dbPath), (err,data) => {
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
                fs.writeFile(path.resolve(__dirname, dbPath), JSON.stringify(newArr))
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
                return res.send({message: "Введите код", sms: smsCode, person: person})
            } else {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
                return res.send({message: "Такой пользователь не существует"})
            }
            
        })

    }
)


router.post(
    '/getAllUsers',
    jsonParser,
    async (req, res) => {

        fs.readFile(path.resolve(__dirname, dbPath), (err, data) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            res.send({body: data})
        })

    }
)

module.exports = router;
