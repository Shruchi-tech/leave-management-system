const express=require("express");
const cors= require("cors");
const authRoutes= require("./controllers/authController");
 
 const app=express();
 app.use(express.json());
 app.use(cors());
 app.use("/api/auth",authRoutes);
 app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route not found"
    });
 });
 app.use((err,req,res)=>{
     res.status(err.status || 500).json({
         success:false,
         message:err.message || "Internal server error"
     });
 });
 app.get("/",(req,res)=>{
    res.send("Leave Management API");
 });
 module.exports =app;