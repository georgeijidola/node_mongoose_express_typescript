import ErrorResponse from "../managers/error/ErrorResponse"

const pruneUpdateFields = (
  allowedFields: string[],
  body: {
    [index: string]: unknown
  }
) => {
  if (allowedFields.length < Object.keys(body).length) {
    throw new ErrorResponse({
      message: "Please remove invalid fields.",
      statusCode: 400,
    })
  }

  let updateFields: {
    [index: string]: unknown
  } = {}

  allowedFields.forEach((allowedField) => {
    if (body[allowedField]) {
      updateFields[allowedField] = body[allowedField]
    }
  })

  return updateFields
}

export default pruneUpdateFields
