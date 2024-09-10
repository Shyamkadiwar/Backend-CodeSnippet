// require('dotenv').config({path:'./env'}) this line will make available all env var as soon as your app starts, but we will us ebelow approch
import dotenv from 'dotenv'
import connectDB from "./db/index.js"; // some time we have to write full ex for solving error
import { app } from './app.js';

dotenv.config({
    path:'./env'
})
// also config in package.json 

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MONGODB connection failed....",error);
})






/*
// this is the one approch to connect data base and init app
import express from 'express'

const app = express()

( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONODB_URI}/${DB_NAME}`)
        app.on('error',(error)=>{
            console.log('error:',error);
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
})()
*/