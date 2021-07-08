import config from "../../../config/Index"
import { createTransport } from "nodemailer"
import MailTemplate from "./MailTemplate"

interface Mail {
  to: string
  subject: string
  message: string
  html?: string
}

const sendNodeMail = async ({
  to,
  subject,
  message,
  html = MailTemplate({ message }),
}: Mail) => {
  try {
    const transport = createTransport({
      service: "yahoo",
      auth: {
        user: config.sender.email,
        pass: config.sender.password,
      },
    })

    const mailOptions = {
      from: "'NodeJS Mongoose Boilerplate' george.ijidola@yahoo.com",
      to,
      replyTo: config.sender.email,
      subject,
      html,
    }

    return await transport.sendMail(mailOptions)
  } catch (error) {
    console.error("Email error ==>> ", error)
  }
}

export { sendNodeMail as SendMail }
