import mongoose from 'mongoose';
import TechnologySchema from './TechnologyModel.js';

const LearningPathSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
    },
  subcategory: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: [TechnologySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LearningPath = mongoose.model('LearningPath', LearningPathSchema);
export default LearningPath;