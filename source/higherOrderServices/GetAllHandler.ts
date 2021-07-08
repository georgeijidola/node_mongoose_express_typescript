import { NextFunction, Request, Response } from "express"
import { Model } from "mongoose"
import queryBuilder from "../managers/higherOrderServices/QueryBuilder"
import SuccessResponse from "../helpers/SuccessResponse"

interface getAllHandlerParameters {
  model: Model<any>
  populateFields?: object[] | string[] | Array<object | string>
  lean?: boolean
  sort?: object
  enablePagination?: boolean
  empty: string
  message?: string
  customQuery?: {
    [index: string]: any
  }
  allowedQueryFields: string[]
  blockTextSearch?: boolean
  select?: string
  req?: Request
  res?: Response
  next?: NextFunction
}

const GetAllHandler = async ({
  model,
  populateFields,
  lean = true,
  sort,
  enablePagination = true,
  empty = "",
  message = "",
  customQuery = {},
  allowedQueryFields,
  blockTextSearch = true,
  select,
  req,
  res,
  next,
}: getAllHandlerParameters) => {
  try {
    let { dbQuery, requestQuery, query } = await queryBuilder({
      type: "a",
      req,
      customQuery,
      allowedQueryFields,
      blockTextSearch,
      model,
      populateFields,
      sort,
      select,
    })

    // Pagination
    const [total, data] = await Promise.all([
      model.countDocuments(requestQuery),
      // Executing query
      lean ? await dbQuery.lean() : await dbQuery,
    ])
    const page = parseInt(query.page!) || 1
    const limit = parseInt(query.limit!) || 50
    const startIndex = (page === 1 ? 1 : page - 1) * limit
    const endIndex = page * limit

    dbQuery = dbQuery.skip(startIndex).limit(limit)

    // Pagination result
    let pagination = {
      nextPage: {
        page: 0,
        limit: 0,
      },
      previousPage: {
        page: 0,
        limit: 0,
      },
      currentPage: 0,
      totalCounts: 0,
      totalPages: 0,
    }

    if (endIndex < total) {
      pagination.nextPage = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      pagination.previousPage = {
        page: page - 1,
        limit,
      }
    }

    pagination.currentPage = page
    pagination.totalCounts = total
    pagination.totalPages = Math.round(total / limit)

    // return data
    const response = {
      error: false,
      statusCode: 200,
      pagination: enablePagination ? pagination : undefined,
      data,
      message: "",
    }

    response.message = data.length === 0 ? empty : message

    if (!res) {
      return response
    } else {
      res.status(response.statusCode).json(
        new SuccessResponse({
          message: response.message,
          pagination: enablePagination ? pagination : undefined,
          data,
        })
      )
    }
  } catch (error) {
    if (next) {
      next(error)
    } else {
      throw error
    }
  }
}

export default GetAllHandler
