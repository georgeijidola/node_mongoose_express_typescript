import { Request, Response } from "express"
import SuccessResponse from "../../../helpers/SuccessResponse"
import { SendMail } from "../../../managers/email/SendMail"
import ForgotPasswordService from "../../../services/auth/ForgotPasswordService"
import asyncHandler from "../../../api/middlewares/Async"

const ForgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const email = req.body.email

    const resetToken = await ForgotPasswordService(email)

    SendMail({
      to: email,
      subject: "Password Reset Link",
      message: `You are receiving this email because a request was received to reset your password. 
      Your reset token is ${resetToken}`,
    })

    res.status(200).json(new SuccessResponse({ message: "Email sent" }))
  }
)

export default ForgotPasswordController
