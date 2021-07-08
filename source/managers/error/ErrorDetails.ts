import ErrorDetailsInterface from "../../interfaces/errors/ErrorDetailsInterface"

class ErrorDetails {
  devMessage: string
  possibleSolution?: string
  validationErrorsExist?: boolean
  errorCode: number

  constructor({
    devMessage = "",
    possibleSolution = "",
    validationErrorsExist = false,
    errorCode = 0,
  }: Partial<ErrorDetailsInterface>) {
    this.devMessage = devMessage
    this.possibleSolution = possibleSolution
    this.validationErrorsExist = validationErrorsExist
    this.errorCode = errorCode
  }
}

export default ErrorDetails
