const express = require('express');
const router = express.Router();
const user = require('../module/user')

router.post("/signin", user.SignIn);
router.post("/signup", user.SignUp);


module.exports = router;