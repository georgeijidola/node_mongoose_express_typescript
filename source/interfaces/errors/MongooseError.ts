interface mongooseError extends Error {
  readonly error?: boolean
  readonly code?: number
  readonly keyValue?: any
  readonly errors?: any
  readonly keyPattern?: any
}

export default mongooseError
