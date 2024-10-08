const mongoose=require('mongoose');
const {tokenTypes}=require('../config/token')

const TokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true,
        index:true
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String,
        enum:[tokenTypes.ACCESS,tokenTypes.REFRESH,tokenTypes.RESET_PASSWORD,tokenTypes.VERIFY_EMAIL],
        required:true
    },
    expires:{
        type:Date,
        required:true
    },
    blacklisted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Token=mongoose.model('Token',TokenSchema)

module.exports=Token
