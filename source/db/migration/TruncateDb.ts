import mongooseLoader from "../../loaders/Mongoose"
import mongoose from "mongoose"

const truncateDatabase = async () => {
  try {
    await mongooseLoader()

    const collections = Object.keys(mongoose.connection.collections)

    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName]

      await collection.deleteMany({})
    }

    console.log("Database Truncated")

    process.exit()
  } catch (error) {
    throw error
  }
}

export default truncateDatabase
