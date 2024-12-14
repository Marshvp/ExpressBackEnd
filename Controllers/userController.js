const { body, validationResult } = require("express-validator");
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
