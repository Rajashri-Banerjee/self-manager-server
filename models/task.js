const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    owner :{
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    starting_time: {
        type : Date
    },
    duration : {
        type : Number
    },
    ending_time : {
        type : Date
    },
    rating : {
        type : Number,
        enum : [1,2,3,4,5]
    },
    stage : {
        type : String,
        required : true,
        default : 'to_do',
        enum : ['to_do','doing','done']
    }
})

const Task = mongoose.model('Task',taskSchema)
module.exports=Task