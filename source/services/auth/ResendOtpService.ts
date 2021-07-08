import GenerateOtp from "../../helpers/auth/GenerateOtp"
import ErrorResponse from "../../managers/error/ErrorResponse"
import { userDocumentDto } from "../../models/user/dto/UserDocumentDto"
import User from "../../models/user/User"

const ResendOtpService = async (email: string) => {
  let user = (await User.findOne({ email })
    .select("email isEmailVerified")
    .lean()) as userDocumentDto

  if (!user) {
    throw new ErrorResponse({
      message: "No user with that email.",
      statusCode: 404,
    })
  }

  if (user.isEmailVerified) {
    throw new ErrorResponse({
      message: "User email already verified.",
      statusCode: 403,
    })
  }

  const otp = GenerateOtp()

  await User.findByIdAndUpdate(user._id, {
    otp,
    otpExpire: new Date(Date.now() + 10 * 60 * 1000),
  })
    .select("_id")
    .lean()

  return otp
}

export default ResendOtpService
