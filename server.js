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
//const chats = require('./routes/chats')
const users = require('./routes/user-routes')
//const opinions = require('./routes/opinion') 
//const items = require('./routes/items')
//const admin = require('./routes/admin')

//app.use('/chat', chat)
//app.use('./opinions', opinions)
app.use('/users', users)
//app.use('/items', items)
//app.use('/admin', admin)

module.exports = app

// Server init
app.listen(app.get('port'), ()=>{
    console.log('Server on port: ', app.get('port'))
})
