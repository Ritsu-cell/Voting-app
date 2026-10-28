const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    Party: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true

    },

    votes: [{
       user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
     },

     votedAT: {
        type: Date,
        default: Date.now( )
     },
    }


]


})

const Candidate = mongoose.model('Candidate',CandidateSchema);
module.exports = Candidate;