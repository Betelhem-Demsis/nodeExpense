const ExpenseSchema=require('../models/expenseModel')
const catchAsync = require('../utils/catchAsync')

exports.createExpense=catchAsync(async(req,res)=>{
    const {title,amount,date,catagory,description}=req.body

    const expense=ExpenseSchema({
        title,
        amount,
        date,
        catagory,
        description
    })
   if(!title || !amount || !date || !catagory || !description){
    return res.status(400).json({
        message:"all fields are required"
    })
    }
    if(amount<=0 || !amount==='number'){
        return res.status(400).json({
            message:"amount are required"
        })
        }

    await expense.save()
    res.status(200).json({
        message:"expense added successfully"
    })  
})

exports.getExpense=catchAsync(async(req,res)=>{
    const expense=await ExpenseSchema.find().sort({createdAt:-1})
    res.status(200).json({
        result:expense.length,
        data: expense
    })
    
})

exports.deleteExpense=catchAsync(async(req,res)=>{
    const {id}=req.params;
    ExpenseSchema.findByIdAndDelete(id).then((expense)=>{
        res.status(200).json({
            message:"expense deleted successfully"
        })
     })
})

