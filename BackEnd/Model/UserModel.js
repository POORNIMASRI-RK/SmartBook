//bcrypt js is used for hash password 
//hash password means it's hide the password in mongodb
//jsonwebtoken - generate login token

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    
});

const User = mongoose.model("user", UserSchema);

module.exports = User;