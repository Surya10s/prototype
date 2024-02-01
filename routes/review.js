const express = require('express')
const router = express.Router({mergeParams:true});
const reviewController = require('../controller/reviewController')
const vd = require('../middleware')

router.post('/',vd.validatereview,reviewController.creatreview)
   
router.delete('/:reviewid',reviewController.deletereview)

module.exports=router