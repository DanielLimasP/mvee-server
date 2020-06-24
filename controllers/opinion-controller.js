const Opinion = require('../models/Opinion')
const User = require('../models/User')

async function sendOpinion(req, res){
    const token = req.headers['x-access-token']
    const userSession = verifyToken(token)

    if(userSession){        
        const { sender, addressee, opinion, rate } = req.body
        const date = Date.now()
        const newOpinion = Opinion({
            sender,
            addressee,
            opinion,
            date, 
            rate
        })
        await newOpinion.save()
        console.log({Message: 'Your opinion has been saved'})
        return res.status(200).send({message: 'Your opinion has been saved!'})
    }else{
        console.log({message: 'Something went wrong with the verification token'})
        return res.status(418).send({message: 'Invalid token and you are a teapot...'})
    }
}

async function getOpinionsFromUser(req, res){
    const token = req.headers['x-access-token']

    if(verifyToken(token)){
        const id = req.body.id
        const opinions = await Opinion.find({_id: id})
        const opinionCount = await Opinion.find({addressee : id}).countDocuments()
        console.log('<--------------------------------------------------------------------->')
        console.log({message: `Opinions of user ${id}`, opinions: opinions})
        return res.status(200).send({message: `Opinions of user ${id}`, opinions: opinions})
    }else{
        return res.status(418).send({message: 'Something went wrong with the validation of the token provided... Try it again...'})
    }
}

// I do have to put this into a separate file and make it work...
async function verifyToken(token){
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
    sendOpinion,
    getOpinionsFromUser
}