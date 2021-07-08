import config from "../../../config/Index"
import mongooseLoader from "../../loaders/Mongoose"
import User from "../../models/user/User"

const importData = async () => {
  try {
    await mongooseLoader()

    const hasSuperAdmin = await User.exists({
      email: config.superAdmin.email,
      isDeleted: false,
    })

    // Check if super admin already exists
    if (!hasSuperAdmin) {
      // Add admin
      await User.create({
        email: config.superAdmin.email,
        password: config.superAdmin.password,
        role: "a",
        isEmailVerified: true,
      })
    }

    console.log("Data imported.")

    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default importData
