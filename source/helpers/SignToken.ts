import config from "../../config/Index"
import jwt from "jsonwebtoken"

const signToken = (text: string) =>
  jwt.sign({ text }, config.jwt.secret, {
    expiresIn: config.jwt.secretExpire,
  })

export default signToken
