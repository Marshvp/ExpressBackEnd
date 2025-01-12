require("dotenv").config();
const express = require("express");
const passport = require("passport"); // Import passport
require("./middleware/passportConfig.js")(passport);
const multer = require("multer");
const blogRouter = require("./Routes/blogRoutes");
const userRouter = require("./Routes/userRoutes");
const commentRouter = require("./Routes/commentRoutes");
const cors = require("cors");
const adminRouter = require("./Routes/adminRoutes.js");

const app = express();

const PORT = 1231;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/api", blogRouter);
app.use("/api/user", userRouter);
app.use("/api/comment", commentRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Listening on on port ${PORT}`);
});
