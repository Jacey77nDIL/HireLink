import pool from "../core/db.js";

// Save a new user to the database
export const createUser = async (name, email, hashedPassword, role) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};

// Find a user by email
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

// Find a user by id
export const findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};