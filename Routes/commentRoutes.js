const { Router } = require("express")

const commentRouter = Router()


commentRouter.post('/', (req, res) => {
    res.json({
        message: "comment router"
    })
})

module.exports = commentRouter