const { body, valadationResult } = require('express-validator')
const db = require('../prisma/queries')


exports.addUser = [
    body('userName')
        .isLength({ min: 4 }).withMessage("Username must be at least 4 characters long")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores")
        .custom(async value => {
            const user = await db.checkUserNameInUse(value)
            if(user){
                throw new Error("Username already in use");
            }
        }),

    body('password')
        .isLength({ min: 6 }).withMessage("Password Must be at least 6 characters long"),
    body('confirmPassword')
        .custom((value, {req}) => {
            if(req.body.password !== value){
                throw new Error("Passwords must match")
            }
        }),
    
    body('email')
        .isEmail().withMessage("Must be a valid email address")
        .custom(async value => {
            const email = await db.checkEmailInUse(value)
            if(email) {
                throw new Error("Email already in use");
            }
        }),

    async (req, res, next) => {
        const errors = valadationResult(req)
        if(!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                data: req.body
            })
        }

        const username = req.body.userName;
        const password = req.body.password
        const email = req.body.email;
        const isAdmin = req.body.isAdmin
        
        await db.addNewUser(username, password, email, isAdmin);
        console.log("New user created successfully")
        res.json({
            message: "New user created successfully"
        })
    }
]