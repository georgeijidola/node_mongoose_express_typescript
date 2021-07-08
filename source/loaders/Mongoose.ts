import mongoose from "mongoose"
import config from "../../config/Index"
import Logger from "./Logger"

const mongooseLoader = async () => {
  try {
    const connect = await mongoose.connect(config.databaseURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      autoIndex: true,
      poolSize: 10,
    })

    Logger.info(
      `✌️ MongoDB connected: ${connect.connection.host} for process ${process.pid}`
    )

    return connect
  } catch (error) {
    Logger.error(`😭 Database connection failed => ${error} ⚠️`)

    await mongooseLoader()
  }
}

export default mongooseLoader
