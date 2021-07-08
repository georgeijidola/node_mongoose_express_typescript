import { NextFunction, Request, Response } from "express"
import SuccessResponse from "../../../helpers/SuccessResponse"
import UpdatePasswordService from "../../../services/userManagement/UpdatePasswordService"
import asyncHandler from "../../middlewares/Async"

const UpdatePasswordController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body

    await UpdatePasswordService({
      confirmNewPassword,
      currentPassword,
      newPassword,
      loggedInUser: req.user.id,
    })

    res.status(200).json(new SuccessResponse({ message: "Password updated." }))
  }
)

export default UpdatePasswordController
