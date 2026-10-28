const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//define the person schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },

    age: {
        type: Number,
        required: true
    },

    
    mobile: {
        type: String,
        
    },

    email: {
        type: String,
        
    },

    AadharNumber: {
        type: Number,
        required: true,
        unique: true
    },

    adress: {
        type: String,
        required: true
    },

    Role: {
        type: String,
        enum:['Voter','admin'],
        default: 'voter'
    },

    isVoted: {
        type: Boolean,
        default: false
    },

    
    Password: {
        type: String,
        required: true
    },
})

userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('Password')) return next();

    try{
        const salt = await bcrypt.qenSalt(10);
        const hashedPassword = await bcrypt.hash(user.Password, salt);
        user.Password = hashedPassword;
        next();
    }
    catch (error) {
        next(error);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
       const isMatch = await bcrypt.compare(candidatePassword, this.Password);
       return isMatch;}
       catch(err){
        throw err;
       }
    }
    const User = mongoose.model('User', userSchema);
    module.exports = User;










const User = mongoose.model('User',userSchemma);
module.export = User;