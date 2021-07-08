import request from "supertest"
import User from "../../../source/models/user/User"
import signToken from "../../../source/helpers/SignToken"
import config from "../../../config/Index"
import expressLoader from "../../../source/loaders/Express"
import Logger from "../../../source/loaders/Logger"
import { userDocumentDto } from "../../../source/models/user/dto/UserDocumentDto"

const apiPrefix = config.api.prefix
const email = "chocolate@mailinator.com"
const password = "7654321"
const confirmPassword = "123i4567"

let adminToken: string

const authBasePath = apiPrefix + "auth/"

const signupPath = authBasePath + "signup"
const signInPath = authBasePath + "signin"
const forgotPath = authBasePath + "forgot-password"
const resendOtpPath = authBasePath + "resend-otp"
const resetPasswordPath = authBasePath + "reset-password"
const verifyPath = authBasePath + "verify"
const apiKey = "?pswd=" + config.api.key

const expressApp = expressLoader()

const app = expressApp.listen(config.port + 3, async () => {
  Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port + 3} 🛡️
      ################################################
    `)
})

const authTest = () => {
  beforeAll(async () => {
    try {
      const user = await User.findOne({ role: "a", isDeleted: false })
        .select("_id")
        .lean()

      adminToken = "Bearer " + signToken(user._id)
    } catch (error) {
      throw error
    }
  })

  it(`Sign Up User - POST ${signupPath}`, (done) => {
    request(app)
      .post(signupPath + apiKey)
      .set("Authorization", adminToken)
      .send({
        email,
        firstName: "Jest",
        lastName: "Tester",
        password,
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .end(done)
  })

  it(`Resend OTP - POST ${resendOtpPath}`, (done) => {
    request(app)
      .post(resendOtpPath + apiKey)
      .send({
        email,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done)
  })

  it(`Verify email - POST ${verifyPath}`, async () => {
    const { otp } = await User.findOne({ email }).select("-_id otp").lean()

    const res = await request(app)
      .post(verifyPath + apiKey)
      .send({
        otp,
        email,
      })

    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/))
    expect(res.status).toBe(200)
  })

  it(`Sign in - POST ${signInPath}`, (done) => {
    request(app)
      .post(signInPath + apiKey)
      .send({
        email,
        password,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done)
  })

  it(`Forgot password - POST ${forgotPath}`, (done) => {
    request(app)
      .post(forgotPath + apiKey)
      .send({
        email,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done)
  })

  it(`Reset password - POST ${resetPasswordPath}`, async () => {
    const { resetPasswordToken } = (await User.findOne({ email })
      .select("-_id resetPasswordToken")
      .lean()) as userDocumentDto

    const res = await request(app)
      .put(resetPasswordPath + apiKey)
      .send({
        resetPasswordToken,
        password: confirmPassword,
        confirmPassword,
      })

    expect(res.headers["content-type"]).toEqual(expect.stringMatching(/json/))
    expect(res.status).toBe(200)
  })

  it(`Login after reset password - POST ${signInPath}`, (done) => {
    request(app)
      .post(signInPath + apiKey)
      .send({
        email,
        password: confirmPassword,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done)
  })

  afterAll(async () => {
    try {
      app.close()
    } catch (error) {
      throw error
    }
  })
}

export default authTest
