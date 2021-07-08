import config from "../../../config/Index"
import mongooseLoader from "../../loaders/Mongoose"
import User from "../../models/user/User"

const deleteData = async () => {
  try {
    await mongooseLoader()

    await User.findOneAndDelete({ email: config.superAdmin.email })

    console.log("Data Deleted")

    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default deleteData
