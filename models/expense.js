const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    date : {
        type : Date,
        required : true
    },
    title : {
        type : String,
    },
    category : {
        type : String,
        required : true,
        enum : ['Food','Travel','Essentials','Education','Self-Care','Others'],
        default : 'Others'
    },
    amount : {
        type : Number,
        required : true
    }
})

const Expense = mongoose.model('Expense',expenseSchema)
module.exports=Expense