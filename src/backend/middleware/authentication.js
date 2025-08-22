import jwt from "jsonwebtoken";
import pool from "../db/db.js";
import bcrypt from "bcryptjs";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "Failed authorization." });
  }

  // verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token." });
    }
    req.user = user;
    next();
  });
}

export async function authenticateUser(req, res, next) {
  console.log("authenticating user");
  let username = req.body.username;
  let password = req.body.password;

  let query = `SELECT * FROM users WHERE username=$1`;
  const result = await pool.query(query, [username]);

  // no such users found
  if (result.rows.length < 1) {
    console.error("No users with given username.");
    return res.status(401).json({ error: "No users with given username." });
  }

  let hashedPassword = result.rows[0].password;

  bcrypt.compare(password, hashedPassword, function (err, result) {
    if (err) {
      console.error("No user with given username and password.");
      return res
        .status(401)
        .json({ error: "No users with given username and password." });
    }
    if (result) {
      next();
    } else {
      // Passwords do not match, deny access
      console.log("Password does not match!");
      return res.status(401).json({ error: "Incorrect password." });
    }
  });
}
