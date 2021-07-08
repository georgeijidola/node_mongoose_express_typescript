import config from "../../../config/Index"
import { verify } from "jsonwebtoken"
import ErrorResponse from "../../managers/error/ErrorResponse"
import { userDocumentDto } from "../../models/user/dto/UserDocumentDto"
import User from "../../models/user/User"

interface resetPasswordParameters {
  resetPasswordToken: string
  password: string
  confirmPassword: string
}

const ResetPasswordService = async ({
  resetPasswordToken,
  password,
  confirmPassword,
}: resetPasswordParameters) => {
  if (!password || password === "") {
    throw new ErrorResponse({
      message: "Password is required.",
      statusCode: 400,
    })
  } else if (!confirmPassword || confirmPassword === "") {
    throw new ErrorResponse({
      message: "Confirm Password is required.",
      statusCode: 400,
    })
  } else if (password !== confirmPassword) {
    throw new ErrorResponse({
      message: "Passwords mismatch.",
      statusCode: 400,
    })
  }

  const decoded = verify(resetPasswordToken, config.jwt.secret) as {
    text: string
  }

  const user = (await User.findOne({
    email: decoded.text,
  }).select("resetPasswordToken resetPasswordTokenExpire")) as userDocumentDto

  if (
    !user ||
    (user.resetPasswordToken === resetPasswordToken &&
      Date.parse(user.resetPasswordTokenExpire! as string) < Date.now())
  ) {
    throw new ErrorResponse({
      error: user
        ? true
        : {
            devMessage: "User with that email not found.",
            possibleSolution: "Put valid email.",

            errorCode: 404,
          },
      message: "Invalid token",
      statusCode: 400,
    })
  }

  // Set new password
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordTokenExpire = undefined

  delete user.password

  return await user.save()
}

export default ResetPasswordService
