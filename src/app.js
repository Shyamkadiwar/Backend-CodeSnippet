import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
})) //use method is used for configuration and middleware major part will be done through app.use(cors()) if u want more options to setting up u may go with the documentation

app.use(express.json({limit:'16kb'})) // we done beacuse we might get diff type of data from forms to servers, we set limit to json so our server do not get crash its important step
app.use(express.urlencoded()) // we done this because we can get data from urls also so we need to encode it, also u can use option for further config  
app.use(express.static("public")) // this will store data like pdf,image ... for temp purpose

app.use(cookieParser()) // for reading cookies of user from user's browser and it can set cookies and perform crud ops


import userRouter from "./routes/user.routes.js";
//routes declaration
app.use("/api/v1/users",userRouter) // this will become prefix like .../api/v1/users/register

export {app}