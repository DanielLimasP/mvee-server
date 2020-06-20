const ItemModel = require('../models/Item')
// Ideally, we would be using jwt with every single route
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const random = require('meteor-random')
const fs = require('fs')
const Item = require('../models/Item')
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
                    // unlinkSync deletes the goddamn image!
                    //fs.unlinkSync(path)
                }
            })
        }
    }else{
        console.log(`User didn't upload any pictures! Bad request`)
        return res.status(400).send({message: 'You must upload at least one image with your item!!!'})
    }
    images = urlArray
    const newItem = new ItemModel({name, owner, description, category, images, location, value, tradeable})
    await newItem.save()
    console.log({message: `Item ${name} has been saved!`})
    return res.status(200).send({message: `Item ${name} has been saved!`})
}

async function getAllItems(req, res){
    const itemCollection = await Item.find()
    const count = await Item.countDocuments({})
    console.log({message: `Items found: ${count}`, itemCollection: itemCollection})
    return res.status(200).send({message: `Items found ${count}`, itemCollection: itemCollection})
}

async function getItemsByUser(req, res){
    const id = req.body.id
    const itemCollection = await Item.find({owner: id})
    const count = await Item.countDocuments({})
    console.log({owner: id, message: `Items found: ${count}`, itemCollection: itemCollection})
    return res.status(200).send({owner:id, message: `Items found ${count}`, itemCollection: itemCollection})
}

async function removeItemById(req, res){
    const id = req.body.id
    await Item.deleteOne({_id: id})
    console.log({message: 'The item has been removed!'})
    return res.status(200).send({message: 'The item has been removed!'})
}

// Parallel function to removeById. Does the same, but in a different way.
async function removeItemByName(req, res){
    const name = req.body.name
    await Item.deleteOne({name: name})
    console.log({message: 'The item has been removed!'})
    return res.status(200).send({message: 'The item has been removed!'})
}

// Ideally, the update function would only update the required fields. However
// we update the whole document...
async function updateItembyId(req, res){
    let {
        id,
        name, 
        owner, 
        description, 
        category,
        images, 
        location, 
        value, 
        tradeable
    } = req.body
    console.log("Body of the update item req")
    console.log(req.body)
    const updatedItem = new ItemModel({name, owner, description, category, images, location, value, tradeable})
    const condition = {_id: id}
    // We are not using replacement object but who cares?
    const replacementObject = {
        name: name,
        owner: owner,
        description: description,
        category: category,
        images: images,
        location: location,
        value: value,
        tradeable: tradeable
    }
    await ItemModel.updateOne(condition, {$set: replacementObject})
    console.log({message: `Item ${name} has been updated!`})
    console.log({message: `Item ${name} has been updated!`, item: replacementObject})
    return res.status(200).send({message: `Item ${name} has been updated!`, item: replacementObject})
}

async function updatePhotos(req, res){
    // TODO: Erase the TODO
    const id = req.body.id
    let newImages = req.body.images
    if(newImages.length > 0){
        urlArray = []
        for(let i = 0; i < newImages.length; i++){
            const path = newImages[i]
            const uniqueFileName = Random.id()
            await cloudinary.uploader.upload(path, {public_id: `mvee/${uniqueFileName}`, tags: 'mvee'}, (err, res ) => {
                if(err){
                    console.log(err)
                }else{
                    imgUrl = res.url
                    urlArray.push(imgUrl)
                    // unlinkSync deletes the goddamn image!
                    //fs.unlinkSync(path)
                }
            })
        }
    }else{
        console.log(`User didn't upload any pictures! Bad request`)
        return res.status(400).send({message: 'You must upload at least one image for the update!!!'})
    }
    const condition = {_id: id}
    await ItemModel.updateOne(condition, {$set: {images: urlArray}})
    console.log({message: 'The images have been updated...'})
    return res.status(200).send({message: 'The images have been updated...'})
}

module.exports = {
    addItem,
    getAllItems,
    getItemsByUser,
    removeItemById,
    updateItembyId,
    updatePhotos
}
