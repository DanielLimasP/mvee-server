let router = require('express').Router()
let itemController = require('../controllers/item-controller')

router.post('/additem', itemController.addItem)

module.exports = router