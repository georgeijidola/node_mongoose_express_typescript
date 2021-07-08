import truncateDatabase from "./migration/TruncateDb"
import deleteData from "./seed/DeleteData"
import importData from "./seed/ImportData"

if (process.argv[2] === "-i") {
  importData()
} else if (process.argv[2] === "-d") {
  deleteData()
} else if (process.argv[2] === "-c") {
  truncateDatabase()
}
