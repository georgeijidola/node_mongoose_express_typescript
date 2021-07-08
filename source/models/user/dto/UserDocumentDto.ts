import { Document } from "mongoose"

export interface userDocumentDto extends Document<any> {
  readonly email: string
  password?: string
  readonly role: string
  isEmailVerified: boolean
  emailVerifiedAt: Date
  readonly isSetupComplete: boolean
  readonly setupCompletedAt: Date
  hasAgreedToTerms: boolean
  resetPasswordToken: string | undefined
  resetPasswordTokenExpire: Date | string | undefined
  otp: string | undefined
  otpExpire: Date | string | undefined
  isDeleted?: boolean
  deletedAt: Date
}
