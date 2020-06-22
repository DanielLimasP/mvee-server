const Message = require('../models/Message')
const User = require('../models/User')
// TODO: Implement jsonwebtoken to provide some sec to msgs
// Actually, jwt has been implemented... Dont forget to add a valid jwt to
// the request headers under 'x-access-token'
const jwt = require('jsonwebtoken')

async function sendMessage(req, res){
    const token = req.headers['x-access-token']
    const userSession = verifyToken(token)
    if (userSession){
        const {sender, addressee, msg} = req.body
        const sentDate = Date.now()
        const newMsg = Message({
            sender,
            addressee,
            msg, 
            sentDate
        })
        await newMsg.save()
        console.log('Message:')
        console.log(req.body)
        return res.status(200).send({message: 'Message sent!'})
    }else{
        return res.status(418).send({message: 'Something went wrong. Probably auth issues, so check your session. I am a teapot, by the way...'})
    }
}

async function getChat(req, res){
    const token = req.headers['x-access-token']
    const userSession = verifyToken(token)
    if(userSession){
        const senderid = req.body.senderid
        const adresseeid = req.body.addresseeid
        const message = await Message.find({sender: senderid, addressee: adresseeid})
        const msgCount = await Message.find({sender: senderid, addressee: adresseeid}).countDocuments()
        console.log({message: 'Messages', msg: message})
        return res.status(200).send({message: 'Chat', count: msgCount, msg: message})
    }else{
        return res.status(200).send({message: 'Chat', count: msgCount, msg: message})
    }
}

// Not actually using this, though it could be useful in the future, maybe...
async function getAllMessages(req, res){
    const message = await Message.find({})
    const msgCount = await Message.find({}).count()
    console.log({message: 'Messages', msg: message})
    return res.status(200).send({message: 'All Messages', count: msgCount, msg: message})
    
}

async function verifyToken(token){
    // Gotta write that stupid utility function...
    if(!token){
        return {auth: false, message: 'No token provided'}
    }else{
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if(err){
                return {auth: false, message: `Failed to authenticate the token provided! ${err}`}
            }else{
               const user = await User.findOne({_id: decoded.id})
               if(!user){
                   console.log({auth: false, message: 'No user found'})
                   return false
               }else{
                   // Some big a** line
                   console.log('<--------------------------------------------------------------------->')
                   console.log("Token validated!", token)
                   console.log({auth: true, message: 'User found!', id: user._id, user: user.nickname})
                   return true
               }
            }
        })
    }
}

module.exports = {
    sendMessage,
    getChat
}