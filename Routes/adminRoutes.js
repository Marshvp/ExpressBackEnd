const { Router } = require("express");
const passport = require("passport");
const verifyAdmin = require("../middleware/verifyAdmin");

const adminRouter = Router();

adminRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  verifyAdmin,
  (req, res) => {
    console.log(req.cookies);
    console.log(req.user);
    res.json({
      message: "Admin Router get",
    });
  },
);

module.exports = adminRouter;
