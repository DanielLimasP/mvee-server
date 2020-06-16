const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    nickname: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    description: {type: String, required: false},
    profileImg: {type: String, required: false},
    userRating: {type: Number, required: false}
})

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    return hash
}

UserSchema.methods.matchPassword = async (password, storedPassword) => {
    return await bcrypt.compare(password, storedPassword)
}

module.exports = mongoose.model('User', UserSchema)