import { createConnection } from "typeorm";

createConnection({
    type: 'postgres',
    database: 'dev',
    username: "root",
    password: "password",
    
})