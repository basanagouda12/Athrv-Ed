const ValidCred = require("../utils/ValidateForm");
const emailModel = require("../model/emailModel");
const userModel = require("../model/userModel");
const profileModel = require("../model/profileModel");
const pool = require("../utils/db-config2");
const reportModel = require("../model/reportModel");

async function returnPromise() {
  return new Promise((resolve, reject) => {
    // asynchronous work
    // asynchronous success

    resolve(date);

    // if fails
    reject(err);
  });
}

// promise.then(data => /* work on data) */ ).catch(err => console.log(err))

// Writing an auth verification

module.exports.editProfile = async (req, res) => {
  try {
    console.log(profileModel.userdetails);
    const isInserted = await profileModel.userdetails(req, res);
    if (!isInserted.status) {
      return res.status(403).json([isInserted.error]);
    }

    return res.status(200).json(isInserted.userData);
  } catch (err) {
    return res.status(500).json([
      {
        type: "server",
        message: "Server error"
      }
    ]);
  }
};

module.exports.postskills = async (req, res) => {
  try {
    const isInserted = await profileModel.skills(req, res);
    if (!isInserted.status) {
      return res.status(403).json([isInserted.error]);
    }
    let Skillset = await pool.query(
      "select * from skillset where user_id = $1",
      [req.body.user]
    );
    if (Skillset.rowCount === 0) {
      skills = {};
    }

    skills = Skillset.rows.map(val => {
      skillInfo = {};
      skillInfo.title = val.title;
      skillInfo.skills = val.skills;
      return skillInfo;
    });

    return res.json({
      skills: skills
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json([
      {
        type: "server",
        message: "Server error"
      }
    ]);
  }
};
module.exports.getProfile = async (req, res) => {
  try {
    const isRecieved = await profileModel.getProfile(req, res);
    const type = req.body.type;
    if (!isRecieved.status) {
      return res.status(403).json([isRecieved.error]);
    }
    const isRecievedQualifications = await profileModel.setQualifications(
      req,
      res
    );
    if (!isRecievedQualifications.status) {
      return res.status(403).json([isRecieved.error]);
    }
    //return res.json(isRecieved.qualification);
    isRecieved.userData.qualification =
      isRecievedQualifications.qualification.qualification;
    isRecieved.userData.type = type;
    console.log(type, " is the user type \n ");
    const addActivities = await reportModel.SuperActivities(req, res);
    //console.log(addActivities);
    isRecieved.userData.activities = addActivities;
    return res.json(isRecieved.userData);
  } catch (err) {
    console.log(err);
    return res.status(500).json([
      {
        type: "server",
        message: "Server error"
      }
    ]);
  }
};
module.exports.setQualifications = async (req, res) => {
  try {
    const isRecieved = await profileModel.setQualifications(req, res);
    if (!isRecieved.status) {
      return res.status(403).json([isRecieved.error]);
    }
    return res.json(isRecieved.qualification);
  } catch (err) {
    console.log(err);
    return res.status(403).json([
      {
        type: "server",
        message: "Server error"
      }
    ]);
  }
};
