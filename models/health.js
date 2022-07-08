const mongoose = require('mongoose')

const healthSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    date : {
        type : Date,
        required : true
    },
    walking : {
        duration : {
            type : Number
        },
        speed : {
            type : Number,
            max : 5
        },
        rating : {
            type : Number,
            enum : [1,2,3,4,5]
        }
    },
    running : {
        duration : {
            type : Number
        },
        speed : {
            type : Number,
            max : 10
        },
        rating : {
            type : Number,
            enum : [1,2,3,4,5]
        }
    },
    workout : {
        title : {
            type : String
        },
        duration : {
            type : Number
        },
        rating : {
            type : Number,
            enum : [1,2,3,4,5]
        }
    },
    food : [{
        title : {
           type : String,
           required : true
        },
        healthy : {
            type : Boolean,
            required : true
        }
    }],
    sleep : {
        duration : {
            type : Number
        }
    },
    weight : {
        type : Number
    },
    social : {
        category : {
            type : String,
            enum : ['Youtube','Facebook','Reddit','Instagram','WhatsApp','Snapchat','Twitter','LinkedIn','Others'],
            default : 'Others'
        },
        duration : {
            type : Number
        }
    }
})

const Health = mongoose.model('Health',healthSchema)
module.exports = Health