import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { USER } from "../constants/index.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Enter a valid email"],
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /[A-z][A-z0-9-_]{3,23}$/.test(value);
        },
        message:
          "Username must be alphanumeric. without special characters.Hyphens and underscore  allowed",
      },
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      validate: [
        validator.isAlphanumeric,
        "First Name can only have alphamuneric characters.No special characters allowed",
      ],
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      validate: [
        validator.isAlphanumeric,
        "Last Name can only have alphamuneric characters.No special characters allowed",
      ],
    },

    password: {
      type: String,
      select: false,
      validate: [
        validator.isStrongPassword,
        "Password must be 8 characters long, with at least 1 uppercase and lowercase letter and with 1 symbol atleast",
      ],
    },

    confirmPassword: {
      type: String,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password do not match",
      },
    },

    isEmailVerified: { type: Boolean, required: true, default: false },
    provider: {
      type: String,
      required: true,
      default: "email",
    },
    googleID: String,
    avatar: String,
    businessName: String,
    phoneNumber: {
      type: String,
      default: "+911234567890",
      validate: {
        validator: function (value) {
          return /^(\+91)?[6-9]\d{9}$/.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid Indian phone number!`,
      },
    },
    address: String,
    city: String,
    country: String,
    passwordChangedAt: Date,
    roles: {
      type: [String],
      default: [USER],
    },
    active: {
      type: Boolean,
      default: true,
    },
    refreshToken: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.roles.length === 0) {
    this.roles.push(USER);
    next();
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = new Date();
  next();
});

userSchema.methods.comparePassword = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
