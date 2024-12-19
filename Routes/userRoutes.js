const { Router } = require("express");
const userController = require("../Controllers/userController");

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.json({
    message: "User Router get",
  });
});

userRouter.post("/addUser", userController.addUser);

userRouter.post("/login", userController.usersLogin);

module.exports = userRouter;
