import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

//post, delete, patch, get, update

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;