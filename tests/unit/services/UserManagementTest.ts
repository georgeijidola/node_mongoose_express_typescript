import User from "../../../source/models/user/User"
import UpdatePasswordService from "../../../source/services/userManagement/UpdatePasswordService"

const userManagementTest = () => {
  let userId: string

  beforeAll(async () => {
    try {
      const user = await User.findOne({
        email: "testy@mailinator.com",
        isDeleted: false,
      })
        .select("_id")
        .lean()

      userId = user._id
    } catch (error) {
      throw error
    }
  })

  it("Update Password", async () => {
    expect(
      await UpdatePasswordService({
        currentPassword: "123i4567",
        newPassword: "7654321",
        confirmNewPassword: "7654321",
        loggedInUser: userId,
      })
    ).toHaveProperty("_id")
  })
}

export default userManagementTest
