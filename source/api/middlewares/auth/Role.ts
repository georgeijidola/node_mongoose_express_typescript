import { NextFunction, Request, Response } from "express"
import ErrorResponse from "../../../managers/error/ErrorResponse"

// Protect routes
const role =
  (roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse({
          message: "User type is unauthorized to access this route",
          statusCode: 403,
        })
      )
    }

    next()
  }

export default role
