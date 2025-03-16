import mongoose from 'mongoose';

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalMessages: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Subcategory = mongoose.model('Subcategory', SubcategorySchema);
export default Subcategory;