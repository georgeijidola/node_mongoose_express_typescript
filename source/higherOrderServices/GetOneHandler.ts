import { NextFunction, Request, Response } from "express"
import { Model } from "mongoose"
import ErrorResponse from "../managers/error/ErrorResponse"
import queryBuilder from "../managers/higherOrderServices/QueryBuilder"
import requestQueryHandler from "../managers/higherOrderServices/RequestQueryHandler"
import SuccessResponse from "../helpers/SuccessResponse"

interface getAllHandlerParameters {
  model: Model<any>
  populateFields?: object[] | string[] | Array<object | string>
  lean?: boolean
  empty: string
  message?: string
  customQuery?: {
    [index: string]: any
  }
  allowedQueryFields: string[]
  blockTextSearch?: boolean
  sort?: object
  select?: string
  token?: string
  req?: Request
  res?: Response
  next?: NextFunction
}

const GetOneHandler = async ({
  model,
  populateFields = [],
  lean = true,
  sort,
  empty = "",
  message = "",
  customQuery = {},
  allowedQueryFields,
  blockTextSearch = true,
  select,
  token,
  req,
  res,
  next,
}: getAllHandlerParameters) => {
  try {
    let { dbQuery } = await queryBuilder({
      type: "s",
      req,
      customQuery,
      allowedQueryFields,
      blockTextSearch,
      model,
      populateFields,
      sort,
      select,
    })

    // Executing query
    const data = lean ? await dbQuery.lean() : await dbQuery

    // return data
    const response = {
      error: false,
      statusCode: 200,
      data,
      message: "",
    }

    response.message = data === null ? empty : message

    if (!res) {
      return response
    } else {
      res
        .status(response.statusCode)
        .json(new SuccessResponse({ message: response.message, data, token }))
    }
  } catch (error) {
    if (next) {
      next(error)
    } else {
      throw error
    }
  }
}

export default GetOneHandler
