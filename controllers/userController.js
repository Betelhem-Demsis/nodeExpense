const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel"); 
const AppError = require("../utils/ApiError");


exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id;
    next()
  }

  exports.updateMe=catchAsync(async(req,res,next)=>{
    if(req.body.password||req.body.confirmPassword){
      return next(new AppError('this route is not for password updates. Please use /updateMyPassword',400))
    }
    const updateUser=await User.findByIdAndUpdate(req.user.id,x,{
      new:true,
      runValidators:true
    })
    
   res.status(200).json({
     status:'success',
     data:{
      user:updateUser 
     }
   })
  })
  
  exports.deleteMe=catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false})
  
    res.status(204).json({
      status:'success',
      data:null
    })
  })


exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    });
});
exports.getUser = catchAsync(async (req, res, next) => {
    
    const user=await User.findById(req.params.id)
    res.status(200).json({
        status: "success",
        data: {
            user
        }
    });
});
exports.createUser = catchAsync(async (req, res) => {
    res.Status(500).json({
        status:"error",
        message:"this route is not yet defined"
    })    
});
exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }
    res.status(204).json({
        status: "success",
        data: null
    });
});