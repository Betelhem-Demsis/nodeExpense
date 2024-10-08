const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/ApiError');



const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken=(user,statusCode,res)=>{
  const token=signToken(user._id)
  const cookieOptions= {
    expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000), 
    httpOnly:true
   }
  if(process.env.NODE_ENV==='production') cookieOptions.secure=true
  res.cookie('jwt',token,cookieOptions)

  user.password=undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });
  createSendToken(newUser,201,res);
});


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user,200,res);
});


exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  req.user = currentUser;
  next();
});


exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return next(new AppError('There is no user with this email address', 404));
    }
  
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
  
    try {
      res.status(200).json({
        status: 'success',
        message: 'Token created successfully'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      return next(new AppError('There was an error processing your request. Try again later!', 500));
    }
  });
  
 
exports.resetPassword=catchAsync(async (req,res,next)=>{
 const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex')

 const user=await User.findOne({passwordResetToken: hashedToken, passwordResetExpires:{$gt:Date.now()}
 });

 if(!user){
  return next(new AppError('token is invalid',400))
 }
 user.password=req.body.password;
 user.confirmPassword=req.body.confirmPassword;
 user.passwordResetToken=undefined;
 user.passwordResetExpires=undefined;
 await user.save();
 createSendToken(user,200,res);
})

exports.updatePassword=catchAsync(async(req,res,next)=>{
  const user=await User.findById(req.user.id).select('+password')

  if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
    return next(new AppError('your current password is wrong',401))
  }

  user.password=req.body.password
  user.confirmPassword=req.body.confirmPassword
  await user.save()
  createSendToken(user,200,res);
})