const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../../config");
const User = require("../models/user");

const { secret } = config;

module.exports.authenthicateUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(400);
  }

  // FINISH: autenticar a la usuarix
  const userFind = User.findOne({ email });

  userFind.then((doc) => {
    if (!doc) {
      return res.status(400).json({
        message: "User Not Exist",
      });
    }
    if (password === doc.password) {
      jwt.sign(
        {
          uid: doc._id,
          email: doc.email,
          roles: doc.roles,
        },
        secret,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) console.error(err);

          return res.status(200).json({ token });
        }
      );
    } else {
      return res.status(404).json({
        message: "Incorrect Password !",
      });
    }
  });
};
