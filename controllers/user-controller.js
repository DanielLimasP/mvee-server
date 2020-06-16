const User = require('../models/User')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const random = require('meteor-random')
const fs = require('fs')
const { verify } = require('crypto')
const { models } = require('mongoose')
const middle = require('../middleware/verifyToken')

// Cloudinary configuration
cloudinary.config({
    cloud_name:'dz6pgtx3t',
    api_key: '874717479975763',
    api_secret: 'I2uZYCzyRbb3Iyz3_lNOR2RN-7k'
})

async function signUp(req, res){
    let {
        nickname, 
        firstname, 
        lastname, 
        email, 
        password, 
        description, 
        profileImg, 
        userRating
    } = req.body
    console.log("Body of the signUp request")
    console.log(req.body)
    const user = await User.findOne({email: email})
    if(user){
        console.log("Email already in use!")
        return res.status(401).send({message: 'Email already in use!'})
    }else{
        if(profileImg.trim() != ''){
            const path = profileImg
            const uniqueFileName = Random.id()
            await cloudinary.uploader.upload(path, {public_id: `mvee/${uniqueFileName}`, tags: 'mvee'}, (err, res) => {
                if(err){
                    console.log(err)
                }else{
                    imgUrl = res.url
                    fs.unlinkSync(path)
                }
            })
        }else{
            imgUrl = "https://res.cloudinary.com/dz6pgtx3t/image/upload/v1592265927/mvee/genericUser_o6pgfa.png"
        }
        console.log("Image uploaded to cludinary!", imgUrl)
        profileImg = imgUrl
        const newUser = new User({nickname, firstname, lastname, email, password, description, profileImg, userRating})
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()
        return res.status(200).send({message: `User ${nickname} has been created`})
    }
}

async function signIn(req, res){
    console.log("Body of the signIn request")
    console.log(req.body)
    let userEmail = req.body.email
    let userPassword = req.body.password
    const user = await User.findOne({email: userEmail})
    if(!user){
        return res.status(404).send({auth: false, message: 'No user found!'})
    }else{
        const passwordMatch = await user.matchPassword(userPassword, user.password)
        if(passwordMatch){
            let token = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: 864000})
            return res.status(200).send({auth: true, message: 'user authenticated', authToken: token})
        }else{
            return res.status(401).send({auth: false, message: 'Incorrect password!'})
        }
    }
}

function logOut(req, res){
    console.log('User logout!')
    return res.status(200).send({auth: false, token: null})
}

function getCurrentUser(req, res){
    let token = req.headers['authorization']
    if(!token){
        return res.status(401).send({auth: false, message: 'No token provided'})
    }else{
        let fields = ['id', 'nickname', 'email']
        // TODO: Write verifyToken function
        middle.verifyToken(token)
            .then((decoded) => {
                models.findOne({id: decoded.id})
            })
            .then((user) => {
                if(!user){
                    return res.status(401).send({auth: false, message: 'No user found'})
                }else{
                    res.status(200).send({message: 'User found!', user: user})
                }
            })
            .catch((err) => {
                res.status(500).send({message: `There was an error! ${err}`})
            })
    }
}

module.exports = {
    signUp,
    signIn,
    logOut,
    getCurrentUser
}