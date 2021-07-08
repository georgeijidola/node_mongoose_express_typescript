import { NextFunction, Request, Response } from "express"
import config from "../../../config/Index"
import Password from "../../helpers/Password"
import ErrorResponse from "../../managers/error/ErrorResponse"
import asyncHandler from "./Async"

const apiCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.pswd) {
      throw new ErrorResponse({
        error: {
          devMessage: "API key is missing.",
          errorCode: 404,
        },
        message: "Something went wrong, please contact support.",
        statusCode: 500,
      })
    }

    const hashedPassword = Password.toHash(config.api.key)

    const isMatch = Password.compare(hashedPassword, req.query.pswd as string)

    if (!isMatch) {
      throw new ErrorResponse({
        error: {
          devMessage: "Invalid API Key.",
          errorCode: 403,
        },
        message: "Something went wrong, please contact support.",
        statusCode: 500,
      })
    }

    next()
  }
)

export default apiCheck
