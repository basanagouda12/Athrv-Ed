const pool = require('../utils/db-config1')

module.exports.Domains = async function () {
  try {
    let domains = await pool.query("select * from domain")
    return Promise.resolve({
      status: true,
      data: domains.rows
    })
  } catch (err) {
    console.log(err)
    return Promise.resolve({
      status: false,
      error: {
        type: "Server error",
        message: "Server error"
      }
    })
  }
}