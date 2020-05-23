const express = require("express");
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const Profile = require("../models/Profile");
const User = require("../models/User");

// @route   GET api/profile/me
// @desc    get current user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userID }).populate(
      "user",
      ["name", "email"]
    );

    if (!profile)
      return res.status(400).json({ msg: "There no profile for this user." });

    res.json(profile);
  } catch (error) {
    console.log("error: ", error.message);
    res.status(500).json("Server Error.");
  }
});

// @route   POST api/profile
// @desc    create or update user profile
// @access  Private
router.post(
  "/",
  [
    auth,
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      company,
      website,
      location,
      status,
      skills,
      youtube,
      facebook,
      linkedin,
      instagram,
      twitter,
    } = req.body;

    // build profileFields object
    const profileFields = {};
    profileFields.user = req.userID;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;

    let profile = await Profile.findOne({ user: req.userID });

    if (profile) {
      //update
      profile = await Profile.findOneAndUpdate(
        { user: req.userID },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  }
);

// @route   GET api/profile
// @desc    get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "email"]);

    res.json(profiles);
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ msg: "Server Error." });
  }
});

// @route   GET api/profile/:user_id
// @desc    get profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "email"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (error) {
    console.log("error", error.message);
    if (error.kind == "objectId")
      return res.status(400).json({ msg: "Profile not found" });

    res.status(500).json({ msg: "Server Error." });
  }
});

// @route   DELETE api/profile
// @desc    delete profile and user
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    // remove Profile
    await Profile.findOneAndRemove({ user: req.userID });

    // remove User
    await User.findOneAndRemove({ _id: req.userID });

    res.json({ msg: "User has been deleted" });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ msg: "Server Error." });
  }
});

// @route   PUT api/profile
// @desc    add profile experience
// @access  Private
router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty)
      return res.status(400).json({ errors: errors.array() });

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.userID });

      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.log("error: ", error.message);
      res.status(500).send("Server Error.");
    }
  }
);

module.exports = router;
