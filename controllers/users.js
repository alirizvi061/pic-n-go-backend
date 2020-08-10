const express = require("express");
const users = express.Router();
const bodyParser = require("body-parser");
const User = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

users.use(bodyParser.urlencoded({ extended: true }));
users.use(express.json());

users.post("/", (req, res) => {
  console.log(res);
  console.log(req);

  User.create(req.body, (err, createdUser) => {
    console.log(req.body);
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(createdUser);
  });
});

users.get("/", (req, res) => {
  User.find({}, (err, foundUser) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(foundUser);
  });
});

users.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(deletedUser);
  });
});

users.put("/:id", (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedUser) => {
      if (err) {
        res.status(400).json({ error: err.message });
      }
      res.status(200).json(updatedUser);
    }
  );
});

module.exports = users;
