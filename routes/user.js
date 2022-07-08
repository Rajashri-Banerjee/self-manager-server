const express = require('express')
const jwt = require('jsonwebtoken')
const Expense = require('../models/expense')
const Health = require('../models/health')
const Task = require('../models/task')
const User = require('../models/user')
const userAuth = require('../middlewares/userAuth')

const router = express.Router()

//User Authentication
router.post('/signup',async(req,res)=> {
    try {
        const user = new User({
            fullname : req.body.fullname,
            username : req.body.username,
            password : req.body.password,
            email : req.body.email,
            contact : req.body.contact
        })

        await user.save()

        res.json({
            user,
            status: 'success'
        })

    } catch (error) {
        res.json({
            status: 'failed',
            error : error.message
        })
    }
})

router.post('/login', async(req,res)=>{
    try {
        const {user,error} = await User.findbyCredentials(req.body.id,req.body.password)
        if(error){
            return res.json({
                status : 'failed',
                error : error
            })
        }
        const token = await jwt.sign({_id : user._id}, process.env.JWT_SECRET)

        res.json({
            user,
            token
        })

    } catch (error) {
        res.json({
            status : 'failed',
            error : error.message
        })
    }
})  

//To Do
router.post('/task', userAuth, async(req,res)=>{
    try {
        const task = new Task({
            owner : req.user._id,
            title : req.body.title,
            description : req.body.description,
            starting_time : req.body.starting_time,
            duration : req.body.duration
        })

        await task.save()

        res.json({
            task
        })
    } catch (error) {
        res.json({
            status : 'failed',
            error : error.message
        })
    }
})

router.get('/task', userAuth, async(req,res)=>{
    const task = await Task.findById(req.query.id)

    res.json({
        task
    })
})


router.get('/tasks', userAuth, async(req,res)=>{
    const tasks = await Task.find({owner : req.user._id})

    res.json({
        tasks
    })
})

router.patch('/task', userAuth, async(req,res) => {
    try {
        const task = await Task.findById(req.body.id)      
        const to_update = Object.keys(req.body)
        for(let i=0;i<to_update.length;i++){
            task[to_update[i]] = req.body[to_update[i]]
        }

        await task.save()

        res.json({
            task
        })
    } catch (error) {
        console.log(error)
        res.json({
            status : 'failed',
            error : error.message
        })
    }
})

router.delete('/task', userAuth, async(req,res) => {
    try {
        if(!req.body.id){
            res.json({
                status : 'failed',
                error : 'Task ID is inaccurate'
            })
        }
        
        const tk = await Task.findById(req.body.id)
        if(!tk){
            return res.json({
                status : 'failed',
                error : `This task doesn't exist or has been deleted`
            })
        }
        if(req.user._id.toString()!=tk.owner.toString()){
            return res.json({
                status : 'failed',
                error : `You don't have permission to delete this task`
            })
        }

        const task = await Task.findByIdAndDelete(req.body.id)

        res.json({
            task,
            status : 'success'
        })
    } catch (error) {
        res.json({
            status : 'failed',
            error : error.message
        })
    }
})

//Health Management
router.post('/health', userAuth, async(req,res) => {
    try {
        const health = await Health.findOne({date : req.body.date, owner : req.user._id})
        if(health){
            return res.json({
                status : 'failed',
                error : 'You already have a health plan for this day'
            })
        }
        const hth = new Health({
            date : req.body.date,
            owner : req.user._id,
            walking : req.body.walking,
            running : req.body.running,
            food : req.body.food,
            sleep : req.body.sleep,
            workout : req.body.workout,
            weight : req.body.weight,
            social : req.body.social
        })

        await hth.save()

        res.json({
            hth
        })
        
    } catch (error) {
        res.json({
            status : 'failed',
            error : error.message
        })
    }
})

router.patch('/health', userAuth, async(req,res) => {
    try {
        const health = await Health.findOne({date : req.body.date})
        if(!health){
            return res.json({
                status : 'failed',
                error : `You don't have a health plan for this day`
            })
        }
        const to_update = Object.keys(req.body)
        for(let i=0;i<to_update.length;i++){
            health[to_update[i]] = req.body[to_update[i]]
        }

        await health.save()

        res.json({
            health,
            status: 'success'
        })
    } catch (error) {
        res.json({
            error: error.message,
            status:'failed'
        })
    }
})

router.delete('/health', userAuth, async(req,res) => {
    try {
        const health = await Health.findOne({date : req.body.date})
        if(!health){
            return res.json({
                status : 'failed',
                error : `No health plan found for this day to be deleted`
            })
        }
        if(req.user._id.toString()!=health.owner.toString()){
            return res.json({
                status : 'failed',
                error : `You don't have permission to delete this health plan`
            })
        }
        const hth = await Health.findOneAndDelete({date : req.body.date})

        res.json({
            hth
        })

    } catch (error) {
        res.json({
            status : 'failed',
            error : error.message
        })
    }
})

router.get('/health', userAuth, async(req,res) => {
    const health = await Health.findOne({date : req.query.date})
    res.json({
        health
    })
})

router.get('/healthplans', userAuth, async(req,res) => {
    const healthplans = await Health.find({owner : req.user._id})
    res.json({
        healthplans
    })
})

//Money Management
router.post('/expense', userAuth, async(req,res) => {
    try {
        const expense = new Expense({
            owner : req.user._id,
            date : req.body.date,
            title : req.body.title,
            category : req.body.category,
            amount : req.body.amount
        })
    
        await expense.save()

        res.json({
            expense
        })

    } catch (error) {
        res.json({
            status : 'failed',
            error : error.message
        })
    }
})

router.patch('/expense', userAuth, async(req,res) => {
    try {
        const expense = await Expense.findById(req.body.id)
        const to_update = Object.keys(req.body)
        for(let i=0;i<to_update.length;i++){
            expense[to_update[i]] = req.body[to_update[i]]
        }

        await expense.save()

        res.json({
            expense
        })
    } catch (error) {
        res.json({
            status : 'failed',
            error : error.message
        })
    }
})

router.get('/expense', userAuth, async(req,res) => {
    const expense = await Expense.findById(req.query.id)
    res.json({
        expense
    })
})

router.get('/expenses', userAuth, async(req,res) => {
    const expenses = await Expense.find({owner : req.user._id})
    res.json({
        expenses
    })
})

module.exports = router