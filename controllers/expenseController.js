const ExpenseSchema=require('../models/expenseModel')

exports.createExpense=async(req,res)=>{
    const {title,amount,date,catagory,description}=req.body

    const expense=ExpenseSchema({
        title,
        amount,
        date,
        catagory,
        description
    })

    try{
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
    }    
    catch(error){
        res.status(500).json({
            message:"Internal server error"
        })
    }
}


exports.getExpense=async(req,res)=>{
    try{
    const expense=await ExpenseSchema.find().sort({createdAt:-1})
    res.status(200).json({
        result:expense.length,
        data: expense
    })
    }
    catch(error){
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

exports.deleteExpense=async(req,res)=>{
    const {id}=req.params;
    ExpenseSchema.findByIdAndDelete(id).then((expense)=>{
        res.status(200).json({
            message:"expense deleted successfully"
        })
     })
    .catch((error)=>{
        res.status(500).json({
            message:"expense server error"
        })
    })
}

