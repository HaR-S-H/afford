import { Router } from "express";
import { getTopComment } from "../controllers/topComment.controller.js";
const router = Router();
router.get("/users", getTopComment);
export default router;