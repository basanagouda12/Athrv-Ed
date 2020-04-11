const express = require('express');
const SelectModal = require('../model/selectModel')
const route = express.Router()

route.get("/select", async (req, res) => {
  try {
    let results;
    switch (req.query.type) {
      case "domains":
        results = await SelectModal.Domains()
        break;
      default:
        return res.status(403).json({
          type: "Invalid action",
          message: "Enter valid parameter"
        })
    }
    if (!results.status)
      return res.status(500).json(results.error)
    return res.json(results.data)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      type: "Server error",
      message: "Server error"
    })
  }
})

module.exports = route