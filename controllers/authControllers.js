import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";

// register function

export const register = async (req, res) => {

   const { users_name, password,name,role} = req.body;

   try {

     const insertSql = `

     INSERT INTO users (users_name,password,name,role)

     VALUES ($1,$2,$3,$4)

     RETURNING id, users_name
     `;

      const hashed = await bcrypt.hash(password, 10);

     const result = await pool.query(insertSql, [users_name, hashed,name,role]);

     const user = result.rows[0];

     res.status(201).json({message: "User registered",user});

   } catch (err) {

      res.status(400).send(err.message);

   }

};