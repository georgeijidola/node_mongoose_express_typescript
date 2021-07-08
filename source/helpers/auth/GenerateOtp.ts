const GenerateOtp = (): string => {
  const digits = "0123456789"

  const otpLength = 6

  let otp = ""

  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length)

    otp += digits[index]
  }

  return otp
}

export default GenerateOtp
