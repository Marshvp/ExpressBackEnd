const { Router } = require("express")

const blogRouter = Router();


blogRouter.get('/', (req, res) => {
    res.json({
        message: "blog Router get"
    })
})

module.exports = blogRouter