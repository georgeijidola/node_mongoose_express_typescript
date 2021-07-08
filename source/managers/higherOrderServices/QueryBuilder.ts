import { Request } from "express"
import { Model } from "mongoose"
import ErrorResponse from "../error/ErrorResponse"
import requestQueryHandler from "./RequestQueryHandler"

const queryBuilder = async ({
  type,
  req,
  customQuery,
  allowedQueryFields,
  blockTextSearch,
  model,
  populateFields,
  sort,
  select,
}: {
  type: string
  req?: Request
  customQuery: object
  allowedQueryFields: string[]
  blockTextSearch: boolean
  model: Model<any>
  populateFields?: object[] | string[] | Array<object | string>
  sort?: object
  select?: string
}) => {
  const { query, requestQuery } = requestQueryHandler({
    req,
    customQuery,
    defaultQueryFields: ["select", "sort", "page", "limit", "pswd"],
    allowedQueryFields,
  })

  // Prepare for search query
  if (requestQuery.search) {
    if (blockTextSearch)
      throw new ErrorResponse({
        message: "Text search blocked for this request.",
        statusCode: 400,
      })

    requestQuery.$text = {
      $search: requestQuery.search,
    }

    delete requestQuery.search
  }

  let dbQuery: any

  // If type is single(s)
  if (type === "s") {
    dbQuery = model.findOne(requestQuery)
    // If type is all(a)
  } else if (type === "a") {
    dbQuery = model.find(requestQuery)
  } else {
    throw new ErrorResponse({
      error: {
        devMessage: "Invalid 'type' value.",
        possibleSolution: "Valid values for 'type' are 's' and 'a'.",
        errorCode: 400,
      },
      message: "Something went wrong, please contact support.",
      statusCode: 400,
    })
  }

  // Populate fields
  populateFields?.map((populateField: object | string) => {
    dbQuery = dbQuery.populate(populateField)
  })

  if (query.select) {
    // Query select comes from req.query
    dbQuery.select(query.select.split(",").join(" "))
  } else if (select) {
    dbQuery.select(select)
  }

  if (query.sort) {
    // Query sort comes from req.query
    dbQuery.select(query.sort.split(",").join(" "))
  } else if (sort) {
    dbQuery.sort(sort)
  }

  return { dbQuery, requestQuery, query }
}

export default queryBuilder
