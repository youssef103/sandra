const express = require("express");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const auth = require("../middlewares/auth");
const User = require("../models/User");

// @route   GET api/auth
// @desc    get user auth
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userID).select("-password");

    res.json(user);
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({
      msg: "Server error",
    });
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get Token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({
        email,
      });

      if (!user)
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid credentials.",
            },
          ],
        });

      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid credentials.",
            },
          ],
        });

      const payload = {
        userID: user.id,
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: config.get("tokenExpiresIn"),
        },
        (err, token) => {
          if (err) throw err;

          res.json({
            token,
          });
        }
      );
    } catch (error) {
      console.log("error -> message", error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
