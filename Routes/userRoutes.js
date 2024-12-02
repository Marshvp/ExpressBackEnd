const { Router } = require("express")


const userRouter = Router();


userRouter.get('/', (req, res) => {
    res.json({
        message: "User Router get"
    })
})

module.exports = userRouter