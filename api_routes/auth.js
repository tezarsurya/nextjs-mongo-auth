const User = require("../models/users");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

// signup route
router.post("/signup", async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hashed) => {
    try {
      // create new user
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      await newUser.save((err, saved) => {
        try {
          if (saved) {
            res.location("/");
            res.status(200).json({
              message: "New user created, please sign in",
              user: saved,
            });
          } else res.status(400).json({ message: "Failed to add user" });
        } catch {
          res.status(400).json(err);
        }
      });
    } catch {
      res.json(err);
    }
  });
});

// signin route
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  await User.findOne({ username: username }, (err, result) => {
    try {
      bcrypt.compare(password, result.password, (err, match) => {
        if (match) {
          // jwt claims
          const claims = { username: result.username, email: result.email };

          // sign jwt
          const token = jwt.sign(claims, process.env.SECRET, {
            expiresIn: "2h",
          });

          res.setHeader(
            "Set-Cookie",
            cookie.serialize("auth", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== "development",
              sameSite: "strict",
              maxAge: 7200,
              path: "/",
            })
          );
          res
            .status(200)
            .json({ message: "you are logged in", authToken: token });
        } else res.status(400).json(err);
      });
    } catch {
      res.status(400).json(err);
    }
  });
});

// check user for form validation
router.post("/usercheck", async (req, res) => {
  const userInput = req.body.userInput;
  await User.find({ username: userInput }, (err, result) => {
    try {
      if (result.length > 0) {
        res.json({ match: true });
      } else res.json({ match: false });
    } catch {
      res.json(err);
    }
  });
});

// signout route
router.get("/signout", (req, res) => {
  res.clearCookie("auth");
  res.location(`${process.env.BASE_URL}`).json({ message: "hello" });
});

module.exports = router;
