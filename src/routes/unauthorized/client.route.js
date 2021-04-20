var mongoose = require('mongoose');
var ApiKeys = mongoose.model('ApiKeys');
 
const express = require('express');
const router = express.Router();

const controller = require('../../controllers').client;

router.get('/as', controller.AS);
router.get('/api_key',async (req,res)=>{
    const api_key = new ApiKeys({key:''});
    await api_key.save();
    res.status(200).json({api_key})
});
module.exports = router;
