import mongoose from 'mongoose';
import ResourceSchema from './RessourceModel.js';

const TechnologySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    resources: [ResourceSchema],
  });

export default TechnologySchema;