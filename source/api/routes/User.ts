import { Router } from "express"
import UpdatePasswordController from "../controllers/user/UpdatePasswordController"
import protect from "../middlewares/auth/Protect"
import role from "../middlewares/auth/Role"

const router = Router()

router.use(protect)

router.put("/password", UpdatePasswordController)

export default router
