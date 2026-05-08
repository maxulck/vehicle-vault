import mongoose from "mongoose";

const cleanTextPattern = /^[a-zA-Z0-9ÁÉÍÓÚÜÑáéíóúüñ ]+$/;
const optionalCleanTextPattern = /^$|^[a-zA-Z0-9ÁÉÍÓÚÜÑáéíóúüñ ]+$/;
const platePattern = /^[a-zA-Z0-9]+$/;

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      match: [cleanTextPattern, "Brand cannot contain special characters"]
    },
    model: {
      type: String,
      required: true,
      trim: true,
      match: [cleanTextPattern, "Model cannot contain special characters"]
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: 2026
    },
    plate: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      match: [platePattern, "Plate can only contain letters and numbers"]
    },
    category: {
      type: String,
      enum: ["car", "motorcycle", "truck", "van", "other"],
      default: "car"
    },
    status: {
      type: String,
      enum: ["available", "maintenance", "sold", "reserved"],
      default: "available"
    },
    mileage: {
      type: Number,
      default: 0,
      min: 0
    },
    acquisitionDate: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      match: [optionalCleanTextPattern, "Notes cannot contain special characters"]
    }
  },
  { timestamps: true }
);

vehicleSchema.index({ owner: 1, plate: 1 }, { unique: true });

export default mongoose.model("Vehicle", vehicleSchema);
