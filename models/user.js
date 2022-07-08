const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    contact : {
        type : String
    }
})

userSchema.statics.findbyCredentials = async(id,password)=>{
    var user = null
    user = await User.findOne({username:id})
    if(!user) {
        user = await User.findOne({email:id})
    }
    if(!user){
        return {
            user : null,
            error : 'User not found'
        }
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return {
            user : null,
            error : 'Email or password is incorrect'
        }
    }
    return {
        user : user,
        error : null
    }
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')) {
         user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)

module.exports=User