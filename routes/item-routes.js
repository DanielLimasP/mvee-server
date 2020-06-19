let router = require('express').Router()
let itemController = require('../controllers/item-controller')

router.post('/additem', itemController.addItem)
router.get('/getallitems', itemController.getAllItems)
router.post('/getitemsbyuser', itemController.getItemsByUser)
router.post('/removeitembyid', itemController.removeItemById)

module.exports = router