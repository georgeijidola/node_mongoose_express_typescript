import { Request, Response } from "express"
import ResetPasswordService from "../../../services/auth/ResetPasswordService"
import SuccessResponse from "../../../helpers/SuccessResponse"
import asyncHandler from "../../../api/middlewares/Async"

const ResetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { resetPasswordToken, password, confirmPassword } = req.body

    await ResetPasswordService({
      resetPasswordToken,
      password,
      confirmPassword,
    })

    res
      .status(200)
      .json(new SuccessResponse({ message: "User password reset successful." }))
  }
)

export default ResetPasswordController
