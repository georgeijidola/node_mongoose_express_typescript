/** @format */

import { Schema, model } from "mongoose"
import ErrorResponse from "../../managers/error/ErrorResponse"
import Password from "../../helpers/Password"
import { userDocumentDto } from "./dto/UserDocumentDto"

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
      select: false,
    },

    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      trim: true,
      enum: {
        values: ["u", "a"],
        message: "Valid values for 'role' are 'user(u)', and 'admin(a)'",
      },
    },

    isEmailVerified: {
      type: Boolean,
      trim: true,
      default: false,
    },

    emailVerifiedAt: { type: Date, select: false },

    resetPasswordToken: { type: String, select: false },

    resetPasswordTokenExpire: { type: Date, select: false },

    otp: { type: String, select: false },

    otpExpire: { type: Date, select: false },

    isSetupComplete: {
      type: Boolean,
      default: false,
      select: false,
    },

    setupCompletedAt: { type: Date, select: false },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },

    deletedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    collation: { locale: "en", caseLevel: false },
  }
)

// Encrypt password using bcrypt
UserSchema.pre<userDocumentDto>("save", async function (next) {
  if (this.isModified("password")) {
    if (this.password!.length < 6) {
      next(
        new ErrorResponse({
          message: "Password must be at least 6 characters",
          statusCode: 400,
        })
      )
    }

    if (this.password!.length > 15) {
      next(
        new ErrorResponse({
          message: "Password cannot cannot exceed 15 characters.",
          statusCode: 400,
        })
      )
    }

    if (
      this.password!.toLowerCase().includes("password") ||
      this.password!.toLowerCase().includes("1234567")
    ) {
      next(
        new ErrorResponse({
          message:
            'Password can not be or include sequence of "password" or "1234567"',
          statusCode: 400,
        })
      )
    }

    const hashedPassword = Password.toHash(this.password!)

    this.password = hashedPassword
  }
})

UserSchema.index({
  email: 1,
  createdAt: 1,
  isDeleted: -1,
})

export default model("User", UserSchema)
