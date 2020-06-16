let router = require('express').Router()
const multipart = require('connect-multiparty')

router.use(multipart({
    uploadDir: 'tmp'
}))

let userController = require('../controllers/user-controller')

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)
router.post('/logout', userController.logOut)
router.get('/me', userController.getCurrentUser)

module.exports = router