import expressLoader from "./Express"
import Logger from "./Logger"
import mongooseLoader from "./Mongoose"

const loaders = async () => {
  await mongooseLoader()

  const app = expressLoader()

  Logger.info("✌️ Express loaded")

  return app
}

export default loaders
