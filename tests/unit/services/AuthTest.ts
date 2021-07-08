import User from "../../../source/models/user/User"
import ForgotPasswordService from "../../../source/services/auth/ForgotPasswordService"
import SignUpService from "../../../source/services/auth/SignUpService"
import ResendOtpService from "../../../source/services/auth/ResendOtpService"
import ResetPasswordService from "../../../source/services/auth/ResetPasswordService"
import SignInService from "../../../source/services/auth/SignInService"
import VerifyAccountService from "../../../source/services/auth/VerifyAccountService"

const authTest = () => {
  const email = "testy@mailinator.com"
  const password = "7654321"
  const confirmPassword = "123i4567"
  let resetPasswordToken: string

  it("Sign Up User", async () => {
    expect(
      await SignUpService({
        email,
        firstName: "Jest",
        lastName: "Tester",
        password,
      })
    ).toEqual(expect.stringMatching(/[0-9]{6}/))
  })

  it("Resend OTP", async () => {
    expect(await ResendOtpService(email)).toEqual(
      expect.stringMatching(/[0-9]{6}/)
    )
  })

  it("Verify email", async () => {
    const { otp } = await User.findOne({ email }).select("-_id otp").lean()

    expect(
      await VerifyAccountService({
        otp,
        email,
      })
    ).toBeTruthy()
  })

  it("Sign in", async () => {
    expect(
      await SignInService({
        email,
        password,
      })
    ).toHaveProperty("_id")
  })

  it("Forgot password", async () => {
    const forgotPassword = await ForgotPasswordService(email)

    resetPasswordToken = forgotPassword

    expect(forgotPassword).toBeTruthy()
  })

  it("Reset password", async () => {
    expect(
      await ResetPasswordService({
        resetPasswordToken,
        password: confirmPassword,
        confirmPassword,
      })
    ).toHaveProperty("_id")
  })

  it("Login after reset password", async () => {
    expect(
      await SignInService({
        email,
        password: confirmPassword,
      })
    ).toHaveProperty("_id")
  })
}

export default authTest
