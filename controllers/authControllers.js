import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";


export const register = async (req, res) => {
   const { username, password, name, role } = req.body;
   try {
       const checkUserSql = "SELECT id FROM users WHERE username = $1";
      const checkResult = await pool.query(checkUserSql, [username]);

      if (checkResult.rows.length > 0) {
         return res.status(400).json({ message: "Username นี้ถูกใช้งานแล้ว" });
      }
      const insertSql = `
         INSERT INTO users (username, password, name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username
      `;
      const hashed = await bcrypt.hash(password, 10);
      const result = await pool.query(insertSql, [username, hashed, name, role]);
      const user = result.rows[0];
      res.status(201).json({ message: "User registered", user });
   } catch (err) {
      res.status(400).send(err.message);
   }
};


export const login = async (req, res) => {
   const { username, password } = req.body ?? {};
   if (!username || !password) {
      return res.status(400).json({ message: "Username & password are required." });
   }

   try {
     
      const { rows } = await pool.query(
         `SELECT id, username,password,role FROM users WHERE username = $1 LIMIT 1`,
         [username]
      );
      
      const user = rows[0];
      if (!user) {
         return res.status(400).json({ message: "User not found" });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ message: "Wrong password" });

      
      const payload = { userId: user.id, username: user.username, role: user.role };

      const accessToken = jwt.sign(
         payload,
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: "15m" } 
      );

      const refreshToken = jwt.sign(
         payload,
         process.env.REFRESH_TOKEN_SECRET,
         { expiresIn: "7d" } 
      );

      return res.json({payload,accessToken,refreshToken});
   } catch (err) {
      return res.status(500).json({ message: err.message });
   }
};


export const refresh = async (req, res) => {
  const { token } = req.body; 

  if (!token) return res.status(401).json({ message: "Refresh Token is required" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });

   const accessToken = jwt.sign(
      { userId: decoded.userId, username: decoded.username }, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
};