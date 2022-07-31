const bcrypt = require('bcrypt');
const { text } = require('body-parser');
const jwt = require('jsonwebtoken');
const userModel = require('../model/user');

const secret = 'test';

exports.SignIn = async (req,res) => {
   const {email, password} = req.body;

    try {
        const existingUser = await userModel.findOne({email});

        if(!existingUser) return res.status(404).json({message: "User doesn't exist" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" })

        const token = jwt.sign({email: existingUser.email, password: existingUser.password, id: existingUser._id}, secret, {expiresIn: "1h"})

        res.status(200).json({ result: existingUser, token})

        
    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
    }
}


exports.SignUp = async (req,res) => {
        const {firstName, lastName, email, password, confirmPassword} = req.body;
    try {

        const existingUser = await userModel.findOne({email});
        if(existingUser) return res.status(400).json({message: "User already exist" })

        if(password !== confirmPassword) return res.status(400).json({ message: "Password Mismatch" })

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await userModel.create({email: email, password: hashedPassword, name: `${firstName} ${lastName}`});
        const token = jwt.sign({email: result.email, id: result._id}, secret, {expiresIn: "1h"})

        res.status(201).json({result, token})


    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
        console.log(error);
    }
}