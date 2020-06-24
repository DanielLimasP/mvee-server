const express = require('express')
const bodyParser = require('body-parser')

const app = express()
require('./database')

// Settings
app.set('port', process.env.PORT || 3000)

// Middlewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Routes: Create the files later
const chats = require('./routes/chat-routes')
const users = require('./routes/user-routes')
const items = require('./routes/item-routes')
//const opinions = require('./routes/opinion-routes') 
//const admin = require('./routes/admin')

app.use('/chats', chats)
app.use('/users', users)
app.use('/items', items)
//app.use('./opinions', opinions)
//app.use('/admin', admin)

module.exports = app

// Server init
app.listen(app.get('port'), ()=>{
    console.log('Server on port: ', app.get('port'))
})
