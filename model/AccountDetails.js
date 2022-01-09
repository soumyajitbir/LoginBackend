const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema =  new Schema({
    Username: String,
    Password: String,
    PlayerName: String,
    Salt:String,
    TutorialPlayed: Boolean,
    FBSignIn: Boolean,
    PlayerLevel: Number,
    PlayerXP: Number,
    NoAdPurchased: Boolean,
    BGMLevel: Number,
    SFXLevel:Number,
    LastAuthentication: Date,
});

mongoose.model('AccountDetails', accountSchema);