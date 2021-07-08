import request from "supertest"
import User from "../../../source/models/user/User"
import signToken from "../../../source/helpers/SignToken"
import config from "../../../config/Index"
import expressLoader from "../../../source/loaders/Express"
import Logger from "../../../source/loaders/Logger"

let userPath = config.api.prefix + "user/"

let adminToken: string, userId: string, userToken: string

const updatePasswordPath = userPath + "password"
const updateUserPath = userPath + "profile"

const expressApp = expressLoader()
const apiKey = "?pswd=" + config.api.key

const app = expressApp.listen(config.port + 4, async () => {
  Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port + 4} 🛡️
      ################################################
    `)
})

const userManagementTest = () => {
  beforeAll(async () => {
    try {
      const [admin, user] = await Promise.all([
        User.findOne({ role: "a", isDeleted: false }).select("_id").lean(),
        User.findOne({
          email: "chocolate@mailinator.com",
          isDeleted: false,
        })
          .select("_id")
          .lean(),
      ])

      adminToken = "Bearer " + signToken(admin._id)
      userId = user._id
      userToken = "Bearer " + signToken(user._id)
    } catch (error) {
      throw error
    }
  })

  it(`Update User Password - PUT ${updatePasswordPath}`, (done) => {
    request(app)
      .put(updatePasswordPath + apiKey)
      .set("Authorization", userToken)
      .send({
        currentPassword: "123i4567",
        newPassword: "7654321",
        confirmNewPassword: "7654321",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done)
  })

  // it(`Update Member's first name - PUT ${updateUserPath}`, (done) => {
  //   request(app)
  //     .put(updateUserPath + apiKey)
  //     .set("Authorization", adminToken)
  //     .send({
  //       id: userId,
  //       dOfC: 25,
  //       firstName: "Vanilla",
  //     })
  //     .expect("Content-Type", /json/)
  //     .expect(200)
  //     .end(done)
  // })

  // it(`Get all members - GET ${userPath}all`, (done) => {
  //   request(app)
  //     .get(`${userPath}all${apiKey}`)
  //     .set("Authorization", adminToken)
  //     .expect("Content-Type", /json/)
  //     .expect(200)
  //     .end(done)
  // })

  // it(`Get one member - GET ${userPath + userId}`, (done) => {
  //   request(app)
  //     .get(userPath + userId + apiKey)
  //     .set("Authorization", adminToken)
  //     .expect("Content-Type", /json/)
  //     .expect(200)
  //     .end(done)
  // })

  // it(`"Delete Member - DELETE ${userPath + userId}`, (done) => {
  //   request(app)
  //     .delete(userPath + userId + apiKey)
  //     .set("Authorization", adminToken)
  //     .expect("Content-Type", /json/)
  //     .expect(200)
  //     .end(done)
  // })

  afterAll(async () => {
    try {
      app.close()
    } catch (error) {
      throw error
    }
  })
}

export default userManagementTest
