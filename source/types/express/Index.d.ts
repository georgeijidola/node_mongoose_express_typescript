import { userDocumentDto } from "../../../models/user/dto/UserDocumentDto"

declare global {
  namespace Express {
    export interface Request {
      user: userDocumentDto
    }
  }
}
