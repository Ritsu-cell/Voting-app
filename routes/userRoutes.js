const express = require('express');
const router = express.Router(); 
const User = require('../models/user');
const {jwtAuthMidlleware , generateToken} = require('./../jwt');
const Candidate = require('../models/candidate');

router.post('/signup',async(req,res) => {
    try{

        const {adhaarCardNumber , password} = req.body

        const newUser = new User(data);

       

        const response = await newUser.save();
        console.log('User created successfully:', response);

        const playload = {
            id: response._id,
        }

        console.log(JSON.stringify(playload));
        const token = generateToken(playload);
        console.log("Token is:",token);

        res.status(200).json({response: response, token:token});


    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({error: "Internal server error"});
    }
})

//login route
router.post('/login',async(req,res) =>{
    try {
        const {adhaarCardNumber , password} = req.body;

        const user = await User.findOne({adhaarCardNumber: adhaarCardNumber});

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: "Invalid username or password"});
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({error: "Invalid credentials"});
        }

        const playload = {
            id: user._id,
        }

        const token = generateToken(playload);

        res.status(200).json({token: token});
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({error: "Internal server error"});
    }})


    router.get('/profile', jwtAuthMidlleware, async (req, res) => {
        try {
            const userData = req.user;
            const userId = userData.id; // Assuming the user ID is stored in req.user after JWT authentication
            const user = await User.findById(userId);
             // Exclude password from the response
              res.status(200).json({user});
        } catch (error) {
            console.error(err);
            res.status(500).json({erroor: 'Internal Server Error'});
        }
    });

    router.put('/profile/password', jwtAuthMidlleware, async (req, res) => {
        try{
            const userID = req.user;
            const {currentPassword , newPassword} = req.body;

            const user = await User.findById(userID);

            if(!(await user.comparePassword(currentPassword))){
                return res.status(401).json({error: "Current password is incorrect"});
            }

            // Update the user's password
            user.password = newPassword;
            await user.save();
            console.log("Password updated successfully:");
            

            res.status(200).json({message: "Password updated successfully"});
        } catch (error) {
            console.error("Error updating password:", error);
            res.status(500).json({error: "Internal server error"});
        }
    });




