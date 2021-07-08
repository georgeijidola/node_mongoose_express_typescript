import request from "supertest"
import config from "../../../config/Index"
import expressLoader from "../../../source/loaders/Express"
import Logger from "../../../source/loaders/Logger"

const expressApp = expressLoader()
const apiKey = "?pswd=" + config.api.key

const app = expressApp.listen(config.port, () => {
  Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `)
})

const healthCheckTest = () => {
  it("Get /", (done) => {
    request(app)
      .get("/" + apiKey)
      .expect(200)
      .end(done)
  })

  it("Get /status", (done) => {
    request(app)
      .get("/status" + apiKey)
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

export default healthCheckTest
