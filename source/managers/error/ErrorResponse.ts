import Response from "../../interfaces/Response"
import ErrorDetails from "./ErrorDetails"

class ErrorResponse extends Error implements Response {
  message: Response["message"]
  statusCode: Response["statusCode"]
  error: Response["error"]
  data: Response["data"]
  token: Response["token"]
  pagination: Response["pagination"]

  public constructor({
    message = "Internal Server error.",
    statusCode = 500,
    error,
    data = {},
    token,
    pagination,
  }: Partial<Response>) {
    super(message)

    this.message = message
    this.statusCode = statusCode
    this.error = new ErrorDetails(typeof error === "object" ? error : {})
    this.data = data
    this.token = token
    this.pagination = pagination
  }
}

export default ErrorResponse
