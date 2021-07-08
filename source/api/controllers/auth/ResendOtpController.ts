import { Request, Response } from "express"
import SuccessResponse from "../../../helpers/SuccessResponse"
import { SendMail } from "../../../managers/email/SendMail"
import ResendOtpService from "../../../services/auth/ResendOtpService"
import asyncHandler from "../../../api/middlewares/Async"

const ResendOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const email = req.body.email

    const otp = await ResendOtpService(email)

    SendMail({
      to: email,
      subject: "Email Verification",
      message: `Your secret code is ${otp}`,
    })

    res.status(200).json(new SuccessResponse({ message: "OTP resent." }))
  }
)

export default ResendOtpController
