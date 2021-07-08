import ErrorResponse from "../../managers/error/ErrorResponse"
import { userDocumentDto } from "../../models/user/dto/UserDocumentDto"
import User from "../../models/user/User"

const VerifyAccountService = async ({
  otp,
  email,
}: {
  otp: string
  email: string
}) => {
  let user = (await User.findOne({
    email,
  }).select("otp otpExpire isEmailVerified")) as userDocumentDto

  if (
    !user ||
    (user.otp === otp && Date.parse(user.otpExpire! as string) < Date.now())
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

  if (user.isEmailVerified) {
    throw new ErrorResponse({
      message: "User already verified",
      statusCode: 403,
    })
  }

  // Set new password
  user.isEmailVerified = true
  user.emailVerifiedAt = new Date()
  user.otp = undefined
  user.otpExpire = undefined

  await user.save()

  return user._id
}

export default VerifyAccountService
