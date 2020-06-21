const router = require('express').Router()
const chatController = require('../controllers/chat-controller')

router.post('/send', chatController.sendMessage)
router.post('/getchat', chatController.getChat)

module.exports = router