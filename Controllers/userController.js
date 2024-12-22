const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const SECRET_KEY = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const db = require("../prisma/queries");

exports.addUser = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password Must be at least 6 characters long"),

  body("confirmPassword").custom((value, { req }) => {
    console.log("ConfirmPassword validator hit");
    console.log("value", value);
    console.log("password", req.body.password);
    if (value !== req.body.password) {
      throw new error("Passwords must match");
    }
    return true;
  }),
  body("username")
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .custom(async (value) => {
      console.log("Checking the username...", value);
      const user = await db.checkUserNameInUse(value);
      if (user) {
        throw new Error("Username already in use");
      } else {
        return true;
      }
    }),

  body("email").custom(async (value) => {
    console.log("Checking the email...", value);
    const email = await db.checkEmailInUse(value);
    if (email) {
      throw new Error("Email already in use");
    } else {
      return true;
    }
  }),

  async (req, res) => {
    console.log("hit");

    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
        data: req.body,
      });
    }

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const isAdmin = req.body.isAdmin ? req.body.isAdmin : false;

    await db.addNewUser(username, password, email, isAdmin);
    console.log("New user created successfully");
    res.json({
      message: "New user created successfully",
    });
  },
];

exports.usersLogin = [
  body("email")
    .isEmail()
    .withMessage("Must be a valid email type")
    .bail()
    .custom(async (value) => {
      const user = await db.checkEmailInUse(value);
      if (!user) {
        throw new Error("Email or Password not recognised");
      } else {
        return true;
      }
    }),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Must be a valid Length")
    .notEmpty()
    .withMessage("Password Required"),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }
    console.log("Request Body: ", req.body);
    const { email, password } = req.body;
    try {
      const user = await db.checkEmailInUse(email);
      if (!user) {
        return res.status(404).json({ message: "User Not Found in DB" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or Password" });
      }
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "2m",
      });
      return res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user.id, email: user.email, username: user.userName },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
];
