const mongoose = require('mongoose')
const { Schema } = mongoose

 const messageSchema = new Schema({
     sender: {type: String, required: true},
     addressee: {type: String, required: true},
     msg: {type: String, required: true},
     sentDate: { type: String, required: true} 
 })

 module.exports = mongoose.model('Message', messageSchema)