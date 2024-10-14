import {db} from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const login = (req,res)=>{
        const q = 'select * from "user" where "username" = $1 ';
        db.query(q,[req.body.username],(err,data)=>{
            if(err) return res.status(500).json(err);
            if(data.rows.length===0) return res.status(404).json("user not found !");
            const checkPassword = bcrypt.compareSync(req.body.password,data.rows[0].password);

            if(!checkPassword) return res.status(400).json("Wrong password  or username!");

            const token = jwt.sign({id: data.rows[0].id}, "secretkey");

            const {password , ...others} = data.rows[0];
            res.cookie("accessToken",token,{
                httpOnly:true,
                
                // maxAge: 24 * 60 * 60 * 1000
            }).status(200).json(others);
        });
}

export const register =  (req,res)=>{

    // checking if user exist
      const q = 'select * from "user" where "username" = $1';

   
        db.query(q,[req.body.username],(err,data)=>{
            if(err) return res.status(500).json(err);
            if(data.rows.length) return res.status(409).json("user already exists !");

            // create an userid
            const salt = bcrypt.genSaltSync(10);
             const hashedPassword = bcrypt.hashSync(req.body.password,salt);
             
             const q = 'insert into "user" ("username","email","password","name") values ($1,$2,$3,$4)';
             const values = [
                   req.body.username,
                   req.body.email,
                   hashedPassword,
                   req.body.name
             ]
              db.query(q,values,(err,data)=>{
                 if(err) return  res.status(500).json(err);
                 return res.status(200).json("User has beed created");
             })


       });
       

}



export const logout = (req, res) => {
  res.clearCookie("accessToken", {
      httpOnly: true,  // Consider adding this if you set it during login
      secure: false,    // Set to true in production with HTTPS
      sameSite: "none", // or 'Lax' based on your needs
      path: '/'         // Specify the path if necessary
  }).status(200).json("User has been logged out");
};


export const validate = (req, res) => {
  const userid = parseInt(req.query.userid, 10);
    const token = req.cookies.accessToken;

    console.log("Token received in request: ", token);
  
    if (!token) {
      return res.status(401).json({ valid: false, message: "Not logged in!" });
    }
  
    jwt.verify(token, 'secretkey', (err, userInfo) => {
      if (err) {
        return res.status(403).json({ valid: false, message: "Token is not valid!" });
      }
  
      // Optional: If you want to check if the userid matches
      if (userInfo.id !== userid) {
        return res.status(403).json({ valid: false, message: "User ID mismatch!" });
      }
  
      // Token is valid
      res.status(200).json({ valid: true, user: userInfo });
    });
  };