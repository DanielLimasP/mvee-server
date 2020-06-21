const router = require('express').Router()
const itemController = require('../controllers/item-controller')

// Routes for the items
router.post('/additem', itemController.addItem)
router.get('/getallitems', itemController.getAllItems)
router.post('/getitemsbyuser', itemController.getItemsByUser)
router.post('/removeitembyid', itemController.removeItemById)
router.post('/updateitem', itemController.updateItembyId)
router.post('/updateitemphotos', itemController.updatePhotos)

module.exports = router