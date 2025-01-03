import mongoose from "mongoose";

const verifyResetTokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
    expires: 900,
  },
});

const VerifyResetToken = mongoose.model(
  "VerifyResetToken",
  verifyResetTokenSchema
);
export default VerifyResetToken;
