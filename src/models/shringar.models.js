import mongoose from "mongoose";

const shringarSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    url_path: {
      type: String,
      required: true,
      unique: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      trim: true,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Shringar = mongoose.model("Shringar", shringarSchema);
