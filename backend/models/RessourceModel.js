import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["video", "book", "mindmap"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
});


export default ResourceSchema;