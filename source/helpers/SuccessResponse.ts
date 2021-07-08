import Response from "../interfaces/Response"

class SuccessResponse extends Response {
  public constructor({ message = "", data = {}, token, pagination }: Response) {
    super({ error: false, message, data, token, pagination })

    this.data = data
    this.message = message
    this.token = token
    this.pagination = pagination
  }
}

export default SuccessResponse
