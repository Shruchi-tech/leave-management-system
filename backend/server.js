require("dotenv").config();
const { assert } = require("node:console");
const app= require("./src/app.js");
const pool=require("./src/db/db.js");
const port= process.env.PORT||5000;

async function startServer() {
    try{
        const connection=await pool.getConnection();
        console.log("Databse connected");
        connection.release();

        app.listen(port,()=>{
         console.log(`Server is running at ${port}`)
        });

    }
    catch(err){
        console.log("database connection failed");
        console.error(err.message);
    }
}
startServer();