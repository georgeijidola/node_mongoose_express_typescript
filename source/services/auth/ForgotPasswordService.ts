import ErrorResponse from "../../managers/error/ErrorResponse"
import signToken from "../../helpers/SignToken"
import User from "../../models/user/User"

const ForgotPasswordService = async (email: string) => {
  const resetPasswordToken = signToken(email)

  // Hash token and set to resetPasswordToken
  const user = await User.findOneAndUpdate(
    { email },
    {
      resetPasswordToken,
      resetPasswordTokenExpire: new Date(Date.now() + 10 * 60 * 1000),
    }
  )
    .select("_id")
    .lean()

  if (!user) {
    throw new ErrorResponse({
      message: "User not found with that email.",
      statusCode: 404,
    })
  }

  return resetPasswordToken
}

export default ForgotPasswordService
