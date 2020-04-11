const express=require('express')
const taskInsert = require('./insertTask')
const router=express.Router()

router.use('/insert',taskInsert)

module.exports =router