import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async (req, res) => {    
    let body = {};
    if(req.method === "GET") {
        body = JSON.stringify(
            { message: "welcome to register page"}
        );
        res.status(200).json(body);
    }
    else if(req.method === "POST") {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        
        try {
            const result = await registerBasicUser({ email, username, password });
            const successMsg = `Username ${username} Created Successfully`;
            console.log(successMsg);
            res.status(200).json({ "message" : successMsg });
        }
        catch(e) {
            const errorMsg = e.message;
            console.error(errorMsg);
            res.status(406).json({ "message" : errorMsg });
        }
    }
    
}

const registerBasicUser = async({email, username, password}) => {
    // empty validation
    if(!email) {
      throw new Error("Email cannot be empty");
    }
    if(!username) {
      throw new Error("Username cannot be empty");
    }
    if(!password) {
      throw new Error("Password cannot be empty");
    }
    // check existing record validation
    async function validateUser(criteria, value) {
      // let whereClause = {};
      // whereClause[criteria] = value;
      const user = await prisma.user.findUnique({
        where: { [criteria] : value }
      });
      return user;
    }
    const validateUsernameExist = await validateUser("username" , username);
    if(validateUsernameExist !== null) {
      throw new Error("This username existed, please choose another username.");
    }
    const validateEmailExist = await validateUser("email" , email);
    if(validateEmailExist !== null) {
      throw new Error("This email existed, please choose another email.");
    }
  
    // encrypt the password
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(password, saltRounds)
    // save the record into the database
    async function createUser() {
      const user = {
        "email": email,
        "username": username,
        "password": hashPass
      };
      const _createUser = await prisma.user.create({ data: user });
      return _createUser;
    };
    
    return createUser()
    .catch((e) => {
      throw e
    })
    .finally(async () => {
      await prisma.$disconnect()
    });
  }
  