import dotenv from "dotenv"
import errorHandler from "../source/managers/error/ErrorHandler"

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development"

try {
  const envFound = dotenv.config({ path: "./config/config.env" })

  // if (envFound.error && "development".includes(process.env.NODE_ENV)) {
  //   // This error should crash whole process

  //   throw new Error("⚠️  Couldn't find config.env file  ⚠️")
  // }

  const keys = [
    "MONGODB_URI",
    "JWT_SECRET",
    "JWT_SECRET_EXPIRE",
    "CLIENT",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "PORT",
    "LOG_LEVEL",
    "SENDER_EMAIL",
    "SENDER_EMAIL_PASSWORD",
    "SENTRY_DSN",
    "SENTRY_TRACES_SAMPLE_RATE",
    "API_KEY",
  ]

  let missingKeys: string[] = []

  keys.forEach((key) => {
    !process.env[key] && missingKeys.push(key)
  })

  if (missingKeys.length >= 1) {
    throw new Error(
      `${missingKeys.join(", ")} are missing and must be defined.`
    )
  }
} catch (error) {
  errorHandler(error)

  process.exit(0)
}

const config = {
  /**
   * Super admin details
   */
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },

  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT!, 10),

  /**
   * That long string from mongoDB atlas
   */
  databaseURL: (process.env.NODE_ENV.includes("test")
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI) as string,

  /**
   * JWT secret key and expiration
   */
  jwt: {
    secret: process.env.JWT_SECRET as string,
    secretExpire: process.env.JWT_SECRET_EXPIRE as string,
  },

  /**
   * Client public credentials
   */
  client: {
    url: process.env.CLIENT,
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

  /**
   * API configs
   */
  api: {
    prefix: "/api/v1/",
    key: process.env.API_KEY as string,
  },

  /**
   * Email sender credentials
   */
  sender: {
    email: process.env.SENDER_EMAIL,
    password: process.env.SENDER_EMAIL_PASSWORD,
  },

  /**
   * Sentry credentials
   */
  sentry: {
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE,
  },
}

export default config
