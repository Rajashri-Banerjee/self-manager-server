const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async(req,res,next) => {
    try {
        const token = req.headers.authorization
        if(!token){
            return res.json({
                error : 'User Authentication failed',
                message : 'Login to continue'
            })
        }
        const {_id} = await jwt.verify(token, process.env.JWT_SECRET)

        if(!_id){
            return res.json({
                error : 'Invalid token'
            })
        }
        const user = await User.findById(_id)
        req.user = user
        next()
    } catch (error) {
        return res.json({
            status : 'failed',
            error : error.message
        })
    }
}

module.exports = userAuth