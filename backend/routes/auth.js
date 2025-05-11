const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const JWT_SECRET = "SitaRam";

const fetchuser = require('../middleware/fetchuser')

//ROUTE 1:  Create a user using : POST "/api/auth/createuser" . No login required
router.post('/createuser', [
    body('name', 'Enter a valid name ').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {

    // If there is error then send the user  there is a bad request
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }

    try {
        //Checks the user with email  is already exit or not 
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email  already exits " })
        }

        //making the password  more stronger
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);



        //create the user details and stroe it into the mongodb database 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        // Sending a token to user who has just login in the web app
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        console.log(authToken);
        // msg to the coder
        // res.json(user)
        res.json({ authToken })
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error  ");
    }
})




//ROUTE 2: Authenticate a user using : POST "/api/auth/login" . No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', "Email can't be blank").exists()
], async (req, res) => {

    // If there is error then send the user  there is a bad request
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    //destructuring 
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct Credentials " });
        }

        // It returns a boolean value 
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct Credentials " });
        }
        // Sending a token to user who has just login in the web app
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken })


    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error  ");
    }


})




//ROUTE 3: GET a loggedin user details : POST "/api/auth/getuser" . login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error  ");
    }

})

module.exports = router