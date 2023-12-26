// import { header } from 'express-validator';

// var Jwt =require ('jsonwebtoken')
// const jwtKey= 'e.comm'

// const fetchuser= (res,req,next)=>{
//     const token=req.header('auth-token')
//     if (!token){
//         res.status(401).send({erro:'please authenticate user'})
//     }
//     try {
//         const data= Jwt.verify(token,jwtKey);
//     req.user = data.user 
//     next();
        
//     } catch (error) {
        
//     }
//     res.status(401).send({erro:'please authenticate user'})
// }


// module.export =fetchuser;