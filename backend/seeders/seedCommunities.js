import mongoose from 'mongoose';
import Subcategory from '../models/CommunityModel.js';

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
    imageUrl: '/images/ux.avif',
  },
  {
    name: 'Mobile Development',
    slug: 'mobile',
    description: 'Discuss iOS, Android and cross-platform app development',
    imageUrl: '/images/mobile_app.jpg',
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'Discuss CI/CD, cloud infrastructure and deployment',
    imageUrl: '/images/devops.png',
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud',
    description: 'Discuss AWS, Azure, GCP and cloud architectures',
    imageUrl: '/images/cloud_computing.png',
  },
  {
    name: 'Cybersecurity',
    slug: 'security',
    description: 'Discuss ethical hacking, encryption and security best practices',
    imageUrl: '/images/cybersecurity.jpg',
  },
  {
    name: 'Data Science',
    slug: 'datascience',
    description: 'Discuss machine learning, AI and data analysis',
    imageUrl: '/images/data_science.jpg',
  },
  {
    name: 'Big Data',
    slug: 'bigdata',
    description: 'Discuss Hadoop, Spark and large-scale data processing',
    imageUrl: '/images/big_data.jpeg',
  },
  {
    name: 'Blockchain',
    slug: 'blockchain',
    description: 'Discuss cryptocurrencies, smart contracts and DApps',
    imageUrl: '/images/blockchain.jpg',
  },
  {
    name: 'Game Development',
    slug: 'gamedev',
    description: 'Discuss game engines, graphics and game design',
    imageUrl: '/images/gamedev.jpg',
  },
  {
    name: 'Embedded Systems',
    slug: 'embedded',
    description: 'Discuss IoT, microcontrollers and firmware',
    imageUrl: '/images/embedded.jpg',
  },
  {
    name: 'Computer Networks',
    slug: 'networking',
    description: 'Discuss protocols, routing and network security',
    imageUrl: '/images/networking.jpg',
  },
  {
    name: 'Operating Systems',
    slug: 'os',
    description: 'Discuss Linux, Windows, macOS and kernel development',
    imageUrl: '/images/os.jpg',
  },
  {
    name: 'Testing',
    slug: 'testing',
    description: 'Discuss unit tests, integration tests and QA',
    imageUrl: '/images/testing.avif',
  },
  {
    name: 'Freelancing',
    slug: 'freelance',
    description: 'Discuss contracting and remote work',
    imageUrl: '/images/freelance.jpeg',
  },
  {
    name: 'Startups',
    slug: 'startups',
    description: 'Discuss tech entrepreneurship and funding',
    imageUrl: '/images/startups.png',
  },
  {
    name: 'Tech News',
    slug: 'news',
    description: 'Discuss the latest in technology and innovations',
    imageUrl: '/images/news.jpeg',
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
    await Subcategory.insertMany(subcategories, { ordered: false });
    console.log('Subcategories seeded successfully');
    
    // Exit process
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedSubcategories();