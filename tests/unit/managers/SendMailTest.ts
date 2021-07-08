import { SendMail } from "../../../source/managers/email/SendMail"

const SendMailTest = () => {
  const email = "testy@mailinator.com"

  it("Send email", async () => {
    expect(
      await SendMail({
        to: email,
        subject: "Test subject",
        message: "Test message.",
      })
    ).toBeTruthy()
  })
}

export default SendMailTest
