const mongoose=require('mongoose');

const db=async()=>{
    try{
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connection successful");
    }
    catch(error){
        console.log("connection error");
    }
}

module.exports={db}