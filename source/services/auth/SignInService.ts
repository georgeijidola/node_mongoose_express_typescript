import ErrorResponse from "../../managers/error/ErrorResponse"
import Password from "../../helpers/Password"
import { userDocumentDto } from "../../models/user/dto/UserDocumentDto"
import User from "../../models/user/User"

interface signInParameters {
  email: string
  password: string
}

const SignInService = async ({ email, password }: signInParameters) => {
  // Validate email and password
  if (!email || email === "") {
    throw new ErrorResponse({
      message: "Please provide an email.",
      statusCode: 400,
    })
  }

  if (!password || password === "") {
    throw new ErrorResponse({
      message: "Please provide a password.",
      statusCode: 400,
    })
  }

  const user = (await User.findOne({ email, isDeleted: false })
    .select("role +password isEmailVerified")
    .lean()) as userDocumentDto

  if (!user) {
    throw new ErrorResponse({
      message: "Email doesn't exist.",
      statusCode: 404,
    })
  }

  if (!user.isEmailVerified) {
    throw new ErrorResponse({
      message: "Email has not been verified, please verify.",
      statusCode: 403,
    })
  }

  const passwordsMatch = Password.compare(user.password!, password)

  if (!passwordsMatch) {
    throw new ErrorResponse({
      message: "Email or password is incorrect.",
      statusCode: 400,
    })
  }

  if (!user.isEmailVerified) {
    throw new ErrorResponse({
      message: "Account not verified, please contact support.",
      statusCode: 403,
    })
  }

  delete user.password

  return user
}

export default SignInService
