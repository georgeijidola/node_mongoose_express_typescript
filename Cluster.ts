import cluster from "cluster"
import os from "os"
import Logger from "./source/loaders/Logger"

const cpus = os.cpus().length

if (cluster.isMaster) {
  Logger.info(`
  ################################################
  Master process ${process.pid} is running.
  Forking for ${cpus} CPUs
  ################################################
`)

  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker process ${worker.process.pid} died. On Code ${code} and signal ${signal}`
    )

    cluster.fork()
  })
} else {
  require("./Server")
}
