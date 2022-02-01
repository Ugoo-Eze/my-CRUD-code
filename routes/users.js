const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//------------------UPDATE USER--------------------//
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      //---------------UPDATE USER PASSWORD--------------//
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    //-----------------------------------------------------//

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body, // auto set all inputs inside the body
      });
      res.status(200).json("Account Updated");
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  } else {
    return res.status(403).json("You can only update your account");
  }
});

//-----------------DELETE USER---------------------//
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account deleted sucessfully");
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  } else {
    return res.status(403).json("You can only delete your account");
  }
});

//------------------GET A USER--------------------//
// *  .........getting user by id.......//
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, createdAt, ...other } = user._doc; // rid out unneccesary props in user obj
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json("Couldn't find User");
  }
});

// ?---GET A USER DYNAMICALLY WITH QUERIES--//
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, createdAt, ...other } = user._doc; // rid out unneccesary props in user obj
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json("Couldn't find User");
  }
});

//-----------------FOLLOW A USER---------------------//
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

//-----------------UNFOLLOW A USER---------------------//
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("You do not follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;
