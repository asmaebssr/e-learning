import mongoose from "mongoose";
import { learningPaths } from "../data/learningPaths.js";
import LearningPath from "../models/learningPathModel.js";

const seed = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/e-learning");
    await LearningPath.deleteMany();
    await LearningPath.insertMany(learningPaths);
    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();