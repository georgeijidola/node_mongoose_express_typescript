import { Request } from "express"
import ErrorResponse from "../error/ErrorResponse"

const validateQueryFields = ({
  allowedQueryFields,
  query,
  // sort,
  // select,
  defaultQueryFields,
}: {
  allowedQueryFields: string[]
  query: Request["query"]
  defaultQueryFields: string[]
  sort?: object
  select?: string
}) => {
  // TODO: Validate sort and select

  let allowedFieldsObject: {
    [index: string]: number
  } = {}

  let defaultQueryFieldsObject: {
    [index: string]: string | number
    search: number
  } = {
    search: 1,
  }

  for (let i = 0; i < allowedQueryFields.length; i++) {
    const allowedField = allowedQueryFields[i]

    if (allowedFieldsObject[allowedField])
      throw new ErrorResponse({
        error: {
          devMessage: "Query parameter repetition is not allowed.",
          possibleSolution: "",
          errorCode: 403,
        },
        message: "Something went wrong, please contact support.",
        statusCode: 400,
      })

    allowedFieldsObject[allowedField] = 1
  }

  for (let i = 0; i < defaultQueryFields.length; i++) {
    const defaultQueryField = defaultQueryFields[i]

    if (defaultQueryFieldsObject[defaultQueryField])
      throw new ErrorResponse({
        error: {
          devMessage: "Query parameter repetition is not allowed.",
          possibleSolution: "",
          errorCode: 403,
        },
        message: "Something went wrong, please contact support.",
        statusCode: 400,
      })

    defaultQueryFieldsObject[defaultQueryField] = 1
  }

  for (let field in query) {
    // Remove [operator] for example "age[in]" should return "age"
    field = field.split("[")[0].trim()

    if (!allowedFieldsObject[field] && !defaultQueryFieldsObject[field]) {
      throw new ErrorResponse({
        error: {
          devMessage: "Invalid query parameter.",
          possibleSolution: "",
          errorCode: 403,
        },
        message: "Something went wrong, please contact support.",
        statusCode: 400,
      })
    }
  }
}

export default validateQueryFields
