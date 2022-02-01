const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//------------------------REGISTER USER-----------------------//
router.post("/register", async (req, res) => {
  try {
    //------GENERATE NEW(hashed) PASSWORD-------//
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //-------CREATE NEW USER---------//
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //-------SAVE USER AND RESPONDE-------//
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
//--------------------------------------------------------------//

//---------------------------LOGIN---------------------------//
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      // check for wrong user password
      if (!validPassword) {
        res.status(400).json("worng email and password");
      } else {
        res.status(200).json(user); // send if user data is correct
      }
    } else {
      res.status(400).json("worng email and password");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;


