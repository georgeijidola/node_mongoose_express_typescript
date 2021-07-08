import { Router } from "express"
import ForgotPasswordController from "../controllers/auth/ForgotPasswordController"
import SignUpController from "../controllers/auth/SignUpController"
import ResendOtpController from "../controllers/auth/ResendOtpController"
import ResetPasswordController from "../controllers/auth/ResetPasswordController"
import SignInController from "../controllers/auth/SignInController"
import VerifyEmailController from "../controllers/auth/VerifyEmailController"

const router = Router()

router.post("/signup", SignUpController)
router.post("/signin", SignInController)
router.post("/forgot-password", ForgotPasswordController)
router.post("/resend-otp", ResendOtpController)
router.put("/reset-password", ResetPasswordController)
router.post("/verify", VerifyEmailController)

export default router
