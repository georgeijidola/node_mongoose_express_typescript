import { NextFunction, Request, Response } from "express"
import DecipherToken from "../../../helpers/auth/DecipherToken"
import asyncHandler from "../Async"

// Protect routes
const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await DecipherToken(req.headers.authorization)

    req.user = user

    next()
  }
)

export default protect
