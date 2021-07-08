import { Router } from "express"
import Auth from "./routes/Auth"
import User from "./routes/User"

const router = Router()

router.use("/auth", Auth)
router.use("/user", User)

export default router
