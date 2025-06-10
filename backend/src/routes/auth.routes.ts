import { Router, RequestHandler } from "express";
import { loginUser, registerUser } from "../controllers/auth";

const router = Router();

router.post('/register', registerUser as RequestHandler);
router.post('/login', loginUser as RequestHandler);

export default router;