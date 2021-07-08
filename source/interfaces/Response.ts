import ErrorDetails from "../managers/error/ErrorDetails"
import pagination from "./Pagination"

class Response {
  error?: ErrorDetails | boolean
  message: string
  statusCode?: number
  data?: object | object[]
  token?: string
  pagination?: pagination

  constructor({
    error,
    message,
    statusCode,
    data,
    token,
    pagination,
  }: Response) {
    this.error = error
    this.message = message
    this.statusCode = statusCode
    this.data = data
    this.token = token
    this.pagination = pagination
  }
}

export default Response
