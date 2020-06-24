const mongoose = require('mongoose')
const { Schema } = mongoose

const OpinionSchema = new Schema({
    sender: {type: String, require: true},
    addressee: {type: String, require: true},
    opinion: {type: String, require: true},
    date: {type: Date, required: true},
    rate: {type: Number, required: true}
})

module.exports = mongoose.model('Opinion', OpinionSchema)