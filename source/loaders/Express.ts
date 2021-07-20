import { json, NextFunction, Request, Response } from "express"
import config from "../../config/Index"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import hpp from "hpp"
import mongoSanitize from "express-mongo-sanitize"
import routes from "../api/Index"
import ErrorResponse from "../managers/error/ErrorResponse"
import errorHandler from "../managers/error/ErrorHandler"
import { sentryTracker, sentryTrackerErrorHandler } from "./SentryTracker"
import apiCheck from "../api/middlewares/APICheck"

const expressLoader = () => {
  const app = express()

  // Useful if you're behind a reverse proxy (Heroku, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable("trust proxy")

  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors())

  // Middleware that transforms the raw string of req.body into json
  app.use(json())

  // Sanitize data
  app.use(mongoSanitize())

  // Set security headers
  app.use(helmet())

  // Rate limit for 10mins
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 30,
  })
  app.use(limiter)

  // Prevent HTTP Param Pollution
  app.use(hpp())

  // Load sentry tracker
  sentryTracker(app)

  // API Key check
  app.use(apiCheck)

  app.get("/", (req: Request, res: Response): void => {
    res.status(200).json("Welcome to NodeJS Mongoose Express Typescript!")
  })

  /**
   * Health Check endpoints
   */
  app.get("/status", (req, res) => {
    res.status(200).end()
  })

  // Load API routes
  app.use(config.api.prefix, routes)

  // Test sentry
  app.get("/debug-sentry", (req, res) => {
    throw new Error("Sentry works!")
  })

  // catch 404 and forward to error handler
  app.use("*", (req: Request, res: Response): void => {
    throw new ErrorResponse({
      error: {
        devMessage: "Incorrect url or method.",
        possibleSolution: "Please check documentation and update according.",
        errorCode: 400,
      },
      message: "Resource not found.",
      statusCode: 404,
    })
  })

  // load sentry track error handler
  sentryTrackerErrorHandler(app)

  // error handlers
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const formattedError = errorHandler(error)

    console.log("formattedError => ", formattedError)

    return res.status(formattedError.statusCode!).json(formattedError)
  })

  return app
}

export default expressLoader
