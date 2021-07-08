import { NextFunction, Request, Response } from "express"
import signToken from "../../../helpers/SignToken"
import GetOneHandler from "../../../higherOrderServices/GetOneHandler"
import { SendMail } from "../../../managers/email/SendMail"
import User from "../../../models/user/User"
import VerifyAccountService from "../../../services/auth/VerifyAccountService"
import asyncHandler from "../../middlewares/Async"

const VerifyEmailController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body

    const userId = await VerifyAccountService({
      email,
      otp,
    })

    const token = signToken(userId)

    await GetOneHandler({
      model: User,
      customQuery: {
        _id: userId,
        isDeleted: false,
      },
      allowedQueryFields: [
        "role",
        "firstName",
        "lastName",
        "email",
        "isEmailVerified",
      ],
      empty: "User doesn't exist.",
      token,
      req,
      res,
      next,
    })

    SendMail({
      to: email,
      subject: "Email verified",
      message: "Congratulations! Your email has been verified.",
    })
  }
)

export default VerifyEmailController
