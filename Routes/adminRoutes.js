const { Router } = require("express");
const passport = require("passport");
const verifyAdmin = require("../middleware/verifyAdmin");
const upload = require("../middleware/multerConfig");
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

adminRouter.post("/createBlog", upload.single("file"), (req, res) => {
  console.log("hit");
  console.log(req.body);
  console.log(req.file);
  if (req.body)
    res.status(200).json({
      message: "Create Blog Hit",
      bodyWas: req.body,
    });
});

module.exports = adminRouter;
