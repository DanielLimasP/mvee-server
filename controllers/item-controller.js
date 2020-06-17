const Item = require('../models/Item')
// Idealy, we will be using jwt with every single route
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const random = require('meteor-random')
const fs = require('fs')
// Cloudinary configuration
cloudinary.config({
    cloud_name:'dz6pgtx3t',
    api_key: '874717479975763',
    api_secret: 'I2uZYCzyRbb3Iyz3_lNOR2RN-7k'
})

async function addItem(req, res){
    let {
        name, 
        owner, 
        description, 
        category, 
        images, 
        location, 
        value, 
        tradeable
    } = req.body
    console.log("Body of the add item req")
    console.log(req.body)
    if(images.length > 0){
        urlArray = []
        for(let i = 0; i < images.length; i++){
            const path = images[i]
            const uniqueFileName = Random.id()
            await cloudinary.uploader.upload(path, {public_id: `mvee/${uniqueFileName}`, tags: 'mvee'}, (err, res ) => {
                if(err){
                    console.log(err)
                }else{
                    imgUrl = res.url
                    urlArray.push(imgUrl)
                    fs.unlinkSync(path)
                }
            })
        }
    }else{
        console.log(`User didn't upload any pictures! Bad request`)
        return res.status(400).send({message: 'You must upload at least one image with your item!!!'})
    }
    images = urlArray
    const newItem = new Item({name, owner, description, category, images, location, value, tradeable})
    await newItem.save()
    console.log({message: `Item ${name} has been saved!`})
    return res.status(200).send({message: `Item ${name} has been saved!`})
}

module.exports = {
    addItem
}
