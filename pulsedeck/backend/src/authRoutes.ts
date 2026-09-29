import { type Request, type Response, Router } from "express";
import { validateResource } from "./validate";
import { authRequestSchema } from "./schemas";
import { authenticateToken } from "./authMiddleware";
import { pool } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
// POST /api/auth — register
router.post(
  "/",
  validateResource(authRequestSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const userCheck = await pool.query(
        `SELECT email FROM users WHERE email = $1`,
        [email],
      );
      if (userCheck.rows.length > 0) {
        return res.status(409).json({ error: "Email already exists." });
      }
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const result = await pool.query(
        `INSERT INTO users (email, password_hash)
         VALUES ($1, $2)
         RETURNING id, email`,
        [email, passwordHash],
      );
      res.status(201).json({
        message: "User registered successfully!",
        user: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);
// POST /api/auth/login — returns a JWT
router.post(
  "/login",
  validateResource(authRequestSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);
      const user = result.rows[0];
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (isValidPassword) {
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: "1h" },
        );
        return res.json({
          message: "Login successful",
          token,
          user: { id: user.id, email: user.email },
        });
      }
      res.status(401).json({ error: "Invalid email or password." });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);
// DELETE /api/auth/:id — delete a user (JWT protected)
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `DELETE FROM users
        WHERE id = $1
        RETURNING id, email`,
        [id],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);
export default router;
