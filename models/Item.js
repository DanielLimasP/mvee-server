const mongoose = require('mongoose')
const { Schema } = mongoose

const ItemSchema = new Schema({
    name: {type: String, required: true},
    owner: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    images: {type: [String]},
    location: {type: locationSchema, required: true}, 
    value: {type: Number, required: true},
    tradeable: {type: Boolean, required: true}
})

const locationSchema = new Schema({
    LATITUDE: {type: String, required: true},
    LONGITUDE: {type: String, required: true}
})