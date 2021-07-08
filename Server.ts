import config from "./config/Index"
import Logger from "./source/loaders/Logger"
import loaders from "./source/loaders/Index"

const startServer = async () => {
  const app = await loaders()

  app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `)
    })
    .on("error", (err) => {
      Logger.error(err)
    })
}

startServer()

// Handle unhandled promise rejections
process.on("unhandledRejection", (error: Error) => {
  console.error(error)

  process.exit(1)
  // TODO: Send mail to first responder
})

// Handle unhandled promise rejections
process.on("uncaughtException", (error: Error) => {
  console.error(error)

  process.exit(1)
  // TODO: Send mail to first responder
})
