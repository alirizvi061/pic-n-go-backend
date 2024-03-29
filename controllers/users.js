const express = require("express");
const users = express.Router();
const bodyParser = require("body-parser");
const User = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECURITY_TOKEN =
  "7cace5e42d1ee59685b0ad5c998587cb2fea48560951f9d07e868deb93fb80ab7180197a3fede258e10d92e59a46df58336b92f817b6a371b11649a228d27631";

users.use(bodyParser.urlencoded({ extended: true }));
users.use(express.json());

//ITEM ROUTES
users.put("/list", (req, res) => {
  User.findById({ _id: req.body._id }, (err, foundUser) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    foundUser.userPicList.push(req.body.image);
    foundUser.notes.push(req.body.notes)
    foundUser.save((err, updatedUser) => {
      res.status(200).json({ updatedUser });
    });
  });
});

users.put('/deleteitem/:id', (req, res) => {

  User.findOneAndUpdate({ _id: req.params.id }, { $pull: { userPicList: { $in: req.body.picture } } }, { multi: true }, (err, foundUser) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(200).json({ foundUser })
    // if(foundUser) {
    //   foundUser.userPicList.splice(req.body.picture);
    //   foundUser.save((err, deletedItem) => {
    // res.status(200).json({ deletedItem });
    //   });
    // }
  })
})

// users.put('/deleteitem/:id', (req, res) => {
//   console.log('hitting delete route')
//   console.log(req.body)
//   User.findById({ _id: req.params.id }, { picture: req.body.picture }, (err, updatedUser) => {
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     } else {
//       console.log(res.json())
//       foundUser.userPiclist.pull(picture)
//       foundUser.save((err, updatedUser) => {
//         res.status(200).json({ updatedUser });
//         //   console.log(foundUser.userPicList)
//       });
//       console.log(foundUser.userPicList)
//     }
//   })
// })

//USER ROUTES
users.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      let securityToken = jwt.sign(
        { username: user.username },
        SECURITY_TOKEN,
        { expiresIn: "1h" });
      res.status(200).json({
        userPicList: user.userPicList,
        userId: user.id,
        username: user.username,
        securityToken: securityToken,
      });
    } else {
      res.status(401).json({ message: "username/password not found" })
    }
  });
});


users.post("/", (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (foundUser == null) {
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      User.create(req.body, (err, createdUser) => {
        if (err) {
          res.status(400).json({ error: err.message });
        }
        res.status(200).json(createdUser);
      });
    } else {
      res.status(401).json({ messages: "user already exists" });
    }
  })
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

users.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(foundUser);
  })
})
//USER ROUTES END

module.exports = users;
