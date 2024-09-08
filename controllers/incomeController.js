const IncomeSchema=require('../models/incomeModel')
const catchAsync=require('../utils/catchAsync')


exports.createIncome=catchAsync(async(req,res)=>{
    const {title,amount,date,catagory,description}=req.body

    const income=IncomeSchema({
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

    await income.save()
    res.status(200).json({
        message:"Income added successfully"
    })  
})


exports.getIncomes=catchAsync(async(req,res)=>{
    const incomes=await IncomeSchema.find().sort({createdAt:-1})
    res.status(200).json({
        result:incomes.length,
        data: incomes
    })   
})

exports.deleteIncome=catchAsync(async(req,res)=>{
    const {id}=req.params;
    IncomeSchema.findByIdAndDelete(id).then((income)=>{
        res.status(200).json({
            message:"Income deleted successfully"
        })
     })
})
