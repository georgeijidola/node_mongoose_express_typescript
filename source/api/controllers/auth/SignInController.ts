import { NextFunction, Request, Response } from "express"
import signToken from "../../../helpers/SignToken"
import GetOneHandler from "../../../higherOrderServices/GetOneHandler"
import User from "../../../models/user/User"
import SignInService from "../../../services/auth/SignInService"
import asyncHandler from "../../../api/middlewares/Async"

const SignInController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password } = req.body

    const user = await SignInService({ email, password })

    const token: string = signToken(user._id)

    await GetOneHandler({
      model: User,
      customQuery: {
        _id: user._id,
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
  }
)

export default SignInController
