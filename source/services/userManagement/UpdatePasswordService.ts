import ErrorResponse from "../../managers/error/ErrorResponse"
import Password from "../../helpers/Password"
import { userDocumentDto } from "../../models/user/dto/UserDocumentDto"
import User from "../../models/user/User"

interface updatePasswordParameters {
  currentPassword: string
  confirmNewPassword: string
  newPassword: string
  loggedInUser: string
}

const UpdatePasswordService = async ({
  confirmNewPassword,
  currentPassword,
  newPassword,
  loggedInUser,
}: updatePasswordParameters) => {
  if (!currentPassword || currentPassword === "") {
    throw new ErrorResponse({
      message: "Current password is required.",
      statusCode: 400,
    })
  } else if (!newPassword || newPassword === "") {
    throw new ErrorResponse({
      message: "New password is required.",
      statusCode: 400,
    })
  } else if (!confirmNewPassword || confirmNewPassword === "") {
    throw new ErrorResponse({
      message: "Confirm new password is required.",
      statusCode: 400,
    })
  } else if (newPassword !== confirmNewPassword) {
    throw new ErrorResponse({
      message: "New passwords mismatch.",
      statusCode: 400,
    })
  }

  const user = (await User.findById(loggedInUser).select(
    "password"
  )) as userDocumentDto

  // Check current password
  if (!Password.compare(user.password!, currentPassword)) {
    throw new ErrorResponse({
      message: "Password is incorrect",
      statusCode: 401,
    })
  }

  user.password = newPassword

  return await user.save()
}

export default UpdatePasswordService
