const router = require('express').Router()
const opinionController = require('../controllers/opinion-controller')

router.post('/sendOpinion', opinionController.sendOpinion)
router.post('/getopinions', opinionController.getOpinionsFromUser)

module.exports = router