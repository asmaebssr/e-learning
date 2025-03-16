import mongoose from 'mongoose';
import Subcategory from '../models/SubcategoryModel.js';

const subcategories = [
  {
    name: 'Frontend Development',
    slug: 'frontend',
    description: 'Discuss HTML, CSS, JavaScript and frontend frameworks',
    imageUrl: '/images/frontend.jpg',
  },
  {
    name: 'Backend Development',
    slug: 'backend',
    description: 'Discuss server-side technologies, APIs and databases',
    imageUrl: '/images/backend.jpg',
  },
  {
    name: 'Fullstack Development',
    slug: 'fullstack',
    description: 'Discuss end-to-end development and architecture',
    imageUrl: '/images/fullstack.jpg',
  },
  {
    name: 'UI Design',
    slug: 'ui',
    description: 'Discuss user interface design, tools and trends',
    imageUrl: '/images/ui.jpg',
  },
  {
    name: 'UX Design',
    slug: 'ux',
    description: 'Discuss user experience principles and research',
    imageUrl: '/images/ux.jpg',
  }
];

const seedSubcategories = async () => {
  try {
    // Connect to the database
    await mongoose.connect("mongodb://localhost:27017/e-learning");
    console.log('Connected to database');
    
    // Clear existing data
    await Subcategory.deleteMany({});
    console.log('Existing subcategories removed');
    
    // Insert new data
    await Subcategory.insertMany(subcategories);
    console.log('Subcategories seeded successfully');
    
    // Exit process
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedSubcategories();