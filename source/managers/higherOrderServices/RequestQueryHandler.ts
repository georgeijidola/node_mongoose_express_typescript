import { Request } from "express"
import ErrorResponse from "../error/ErrorResponse"
import { query } from "./interfaces/Query"
import validateQueryFields from "./ValidateQueryFields"

const requestQueryHandler = ({
  req,
  customQuery = {},
  defaultQueryFields = [],
  allowedQueryFields,
}: {
  req?: Request
  customQuery: object
  defaultQueryFields: string[]
  allowedQueryFields: string[]
}) => {
  if (req && req.query) {
    validateQueryFields({
      allowedQueryFields,
      query: req.query,
      defaultQueryFields,
    })

    // Create operators: gt, gte, lt, lte, in

    // Stringify query and attach '$'
    const queryStringified = JSON.stringify(req.query).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    req.query = JSON.parse(queryStringified)

    if (queryStringified.includes("$in")) {
      for (let field in req.query) {
        let queryField = req.query[field] as unknown as {
          $in: string | string[]
        }

        if (queryField.$in) {
          queryField.$in = (queryField.$in as string)
            .split(",")
            .map((value) => value.trim())
        }

        if (queryField.$in.length > 30) {
          throw new ErrorResponse({
            error: {
              devMessage: "$in values cannot be more than 30.",
              possibleSolution: "",
              errorCode: 400,
            },
            message: "Something went wrong please contact support.",
            statusCode: 403,
          })
        }
      }
    }
  }

  const query: Partial<query> =
    req && req.query ? Object.assign(req.query, customQuery) : customQuery

  // Copy query
  let requestQuery: Partial<{
    [index: string]: any
    $text: {
      $search: string
    }
  }> = { ...query }

  // Loop over defaultQueryFields and delete them from requestQuery
  defaultQueryFields.forEach((param) => delete requestQuery[param])

  return { requestQuery, query }
}

export default requestQueryHandler
