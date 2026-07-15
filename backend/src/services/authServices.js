const validator= require("validator");
const pool =require("../db/db");
const bcrypt=require("bcrypt");
const jwt= require("jsonwebtoken");
const login =async({email,password})=>{
     if(!email || !validator.isEmail(email)){
        throw{
            status:400,
            message:"Valid email is required"
        };
     }
     if(!password){
        throw{
            status:400,
            message:"Password is required"
        };
     }

     const [rows]=await pool.execute(
        `Select users.id,
                users.email,
                users.password,
                users.role,
                users.status,
                employees.full_name
        
        from users join employees 
        on users.employee_id=employees.id
        where users.email=?`[email]
     );
     if(rows.length==0){
        throw{
            status:401,
            message:"Invalid email or password"
        };
     }
     const user=rows[0];
     if (user.status==="inactive") {
        throw{
            status:403,
            message:"Account is inactive"
        };
     }
     const isMatch= await bcrypt.compare(password,user.password);
     if(!isMatch){
        throw {
            status:401,
            message:"Invalid email or password"
        };
        
     }
     const token= jwt.sign(
        {
            id:user.id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
     );
     return{
        token,
        user:{
            id:user.id,
            name:user.full_name,
            email:user.email,
            role:user.role
        }
     };
};
module.exports={login};