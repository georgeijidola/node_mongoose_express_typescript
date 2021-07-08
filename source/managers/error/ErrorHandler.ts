import { Response } from "express"
import ErrorResponse from "./ErrorResponse"

const errorHandler = (error: any): ErrorResponse => {
  let message: string | any[]

  if (process.env.NODE_ENV!.includes("development")) {
    // Log to console for dev
    console.error("Error ===>>> ", error)
  }

  if (error.name === "SyntaxError" && error.type === "entity.parse.failed") {
    return new ErrorResponse({
      error: {
        devMessage: "Bad input format.",
        possibleSolution: "",
        errorCode: 400,
      },
      message: "Something went wrong, please contact support.",
      statusCode: 403,
    })
  }

  // Mongoose Duplicate key
  if (error.code === 11000) {
    const field: string = Object.keys(error.keyValue)[0]

    message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } already exists.`

    return new ErrorResponse({ message, statusCode: 400 })
  }

  switch (error.name) {
    case "URIError":
    case "EvalError":
    case "ReferenceError":
    case "RangeError":
    case "TypeError":
      return new ErrorResponse({})

      break

    case "JsonWebTokenError":
      return new ErrorResponse({
        message: "Not authorized to access this route",
        statusCode: 401,
      })

      break

    // Mongoose CastError(ex: bad ObjectId)
    case "CastError":
      return new ErrorResponse({
        error: {
          devMessage: `Invalid value for '${error.path}'`,
          possibleSolution: error.reason.message,
          errorCode: 400,
        },
        message: "Resource not found.",
        statusCode: 404,
      })

      break

    // Mongoose Validation Error
    case "ValidationError":
      message = Object.values(error.errors).map((val: any) => val.message)

      return new ErrorResponse({
        message: message[0],
        statusCode: 400,
      })

      break

    // Token expiration
    case "TokenExpiredError":
      return new ErrorResponse({
        message: "Session expired, please log in again.",
        statusCode: 401,
      })

      break

    // Mongoose Error
    case "MongoError":
      message = Object.keys(error.keyPattern)[0]
      message = `Duplicate value entered for ${
        message.includes(".")
          ? message.split(".")[message.split(".").length - 1]
          : message
      }`

      return new ErrorResponse({ message, statusCode: 400 })

      break

    // Mongoose Network Error
    case "MongoNetworkError":
      // TODO: Add Retry-After to http headers
      return new ErrorResponse({
        message: "Network error, please connect to the internet.",
        statusCode: 503,
      })

      break
  }

  return error
}

export default errorHandler
