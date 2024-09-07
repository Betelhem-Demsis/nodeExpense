const IncomeSchema=require('../models/incomeModel')

exports.addIncome=async(req,res)=>{
    const {title,amount,date,catagory,description}=req.body

    const income=IncomeSchema({
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

    await income.save()
    res.status(200).json({
        message:"Income added successfully"
    })
    }    
    catch(error){
        res.status(500).json({
            message:"Internal server error"
        })
    }
}


exports.getIncomes=async(req,res)=>{
    try{
    const incomes=await IncomeSchema.find().sort({createdAt:-1})
    res.status(200).json({
        result:incomes.length,
        data: incomes
    })
    }
    catch(error){
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

exports.deleteIncome=async(req,res)=>{
    const {id}=req.params;
    IncomeSchema.findByIdAndDelete(id).then((income)=>{
        res.status(200).json({
            message:"Income deleted successfully"
        })
     })
    .catch((error)=>{
        res.status(500).json({
            message:"Internal server error"
        })
    })
}

