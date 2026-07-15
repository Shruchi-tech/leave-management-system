require("dotenv").config();
const bcrypt=require("bcrypt");
async function generateHash(){
    
    try{
          const passwords=[
              "admin123",
              "manager123",
              "employee123"
          ];
          for(const password of passwords){
             const hash = await bcrypt.hash(password,10);
              console.log("---------------------------");
              console.log(`Password : ${password}`);
               console.log(`Hash : ${hash}`);
            }
    }
          catch (error){
            
          }
}
generateHash();