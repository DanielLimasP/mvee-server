const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    nickname: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    description: {type: String, required: false},
    profileImg: {type: String, required: true},
    userRating: {type: Number, required: false}
})

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    return hash
}

UserSchema.methods.matchPAssword = async (password) => {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)