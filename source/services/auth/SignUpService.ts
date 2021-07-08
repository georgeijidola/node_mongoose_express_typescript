import GenerateOtp from "../../helpers/auth/GenerateOtp"
import User from "../../models/user/User"

const SignUpService = async ({
  email,
  firstName,
  lastName,
  password,
}: {
  email: string
  firstName: string
  lastName: string
  password: string
}): Promise<any> => {
  const otp = GenerateOtp()

  const otpExpire = new Date(Date.now() + 10 * 60 * 1000)

  await User.create({
    email,
    firstName,
    lastName,
    password,
    otp,
    otpExpire,
  })

  return otp
}

export default SignUpService
