const express = require('express');
const router = express.Router(); 
const User = require('../models/user');
const {jwtAuthMidlleware , generateToken} = require('./../jwt');
const Candidate = require('../models/candidate');
 
const checkAdminrole = async (userID)=>{
    try {
        const user = await User.findById(userID);
        return user.Role === 'admin';
    } catch (error) {
        console.error("Error checking admin role:", error);
        return false;
    }
};

router.post('/',async(req,res) => {
    try{

        if(! await checkAdminrole(req.user.id)){
            console.log("admin role not found")
            return res.status(404).json({error: "Access denied. Only admin can create candidates."});
        }
      

        const data = req.body;

        const newCandidate = new Candidate(data);

        const response = await newCandidate.save();
        console.log('Candidate created successfully:', response);
        res.status(200).json({response: response});
    } catch (error) {
        console.error("Error creating candidate:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

router.post('/login',async(req,res) =>{
    try {
        if((!checkAdminrole(req.user.id))){
            return res.status(404).json({error: "Access denied. Only admin can login."});
        }
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
    }});



    router.put('/:candidateID', async (req, res) => {
        try{
            if(!checkAdminrole(req.user.id)){
                return res.status(404).json({error: "Access denied. Only admin can update candidates."});
            }
            const candidateID = req.params.candidateID;
            const updateCandidate = req.body;
            const response = await Candidate.findByIdAndUpdate(candidateID, updateCandidate, { new: true, runValoidators:true });
            

            if(!response){
                return res.status(404).json({error: "Candidate not found"});
            }

            console.log("Candidate updated successfully:", response);
            res.status(200).json({response: response});
        } catch (error) {
            console.error("Error updating candidate:", error);
            res.status(500).json({error: "Internal server error"});
        }

           
    })

     router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
         //no admin can vote 
         //only user can vote

         candidateID=req.params.candidateID;
         userID = req.user.id;
         try {
            const candidate = await Candidate.findById(candidateID);
            if(!candidate){
                return res.status(404).json({message: "Candidate not found"});
            }
             const user = await User.findById(userID);if(!user){
                return res.status(404).json({message: "User not found"});
             }
             if(user.isVoted){
                res.status(400).json({message: "User has already voted"});
             }
             if(user.role === 'admin'){
                res.status(403).json({message: "Admin cannot vote"});
             }

             candidate.votes.push({ user: userId });
             candidate.votecount++;
             await candidate.save();


             user.isVoted = true;
             await user.save();

             res.status(200).json({message: "Vote cast successfully"});
     
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'internal server error'});
        }


     });


     //vote count 
     router.get('/vote/count',async (req , res) => {
        try {
            const candidates = (await Candidate.find()).sort({votecount: 'desc'});

            const record = candidate.map((data) => {
                return {
                    party: data.party,
                    count: data.votecount
                };
            });

            res.status(200).json({candidates: record});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'internal server error'});
        }
    });
    module.exports = router;

    