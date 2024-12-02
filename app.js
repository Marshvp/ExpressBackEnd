const express = require('express');
const blogRouter = require('./Routes/blogRoutes');
const userRouter = require('./Routes/userRoutes');
const commentRouter = require('./Routes/commentRoutes');
const cors = require('cors')

const app = express();

const PORT = 1231

app.use(express.json())
app.use(cors())


app.use('/', blogRouter)
app.use('/user', userRouter)
app.use('/comment', commentRouter)


app.listen(PORT, () => {
    console.log(`Listening on on port ${PORT}`);
})