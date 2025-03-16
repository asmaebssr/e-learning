import React, { useEffect, useState } from 'react';
import home from "../images/home.webp";
import { FaLightbulb, FaVideo, FaBook, FaProjectDiagram, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Typewriter from 'typewriter-effect';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const Home = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });

    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    particles: {
      number: {
        value: 50,
      },
      color: {
        value: ['#4f46e5', '#9333ea'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.5,
      },
      size: {
        value: 3,
      },
      move: {
        enable: true,
        speed: 2,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen overflow-hidden">
      {/* Glowing Cursor Effect */}
      <motion.div
        className="fixed w-64 h-64 rounded-full bg-gradient-to-r from-purple-300/20 to-indigo-300/20 blur-3xl pointer-events-none"
        style={{
          left: cursorPosition.x - 128,
          top: cursorPosition.y - 128,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 -z-10"
      />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto pt-16 pb-20 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-8 md:mb-0 md:w-1/2"
          >
            <motion.div
              className="mb-6"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white mb-6 shadow-lg">
                <FaLightbulb className="mr-2" />
                <span className="font-semibold">Interactive Learning</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-900 leading-tight mt-4">
                Transform Your Skills with Immersive Learning
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-gray-700 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Typewriter
                options={{
                  strings: [
                    'Master <span class="text-indigo-600 font-medium">programming</span>, <span class="text-purple-600 font-medium">web development</span>, and more through structured learning paths, interactive challenges, and our vibrant community of learners.',
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 20,
                }}
              />
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Get Started Now</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                className="group relative overflow-hidden bg-white text-indigo-700 border-2 border-indigo-200 px-8 py-4 rounded-xl font-medium shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Explore Learning Paths</span>
                <motion.div
                  className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative ml-12">
              <motion.div
                className=" absolute -inset-4 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-70 blur-3xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
<motion.img
  src={home}
  alt="Learning illustration"
  className="w-full h-auto relative z-10 rounded-2xl shadow-2xl"
  animate={{ y: [0, -10, 0] }} // Floating animation
  transition={{
    duration: 3,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  }}
  whileHover={{ scale: 1.02 }} // Slight scale-up on hover
/>              {/* Floating elements around the image */}
              {/* <motion.div
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl z-20"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FaProjectDiagram className="w-8 h-8 text-purple-500" />
              </motion.div> */}

              {/* <motion.div
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1,
                }}
              >
                <FaBook className="w-8 h-8 text-indigo-500" />
              </motion.div> */}
            </div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div> */}
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div data-aos="fade-up" className="text-center mb-16">
          <span className="inline-block px-6 py-2 rounded-full bg-indigo-100 text-indigo-800 font-medium mb-4">Features</span>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-6">
            Everything You Need to Excel
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Video Feature Card */}
  <div data-aos="fade-up" data-aos-delay="100" className="group">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-gradient relative overflow-hidden">
      <style>
        {`
          .border-gradient {
            border-image: linear-gradient(to right, #4f46e5, #9333ea);
            border-image-slice: 1;
          }
        `}
      </style>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 transform scale-0 group-hover:scale-100 transition-all duration-500 rounded-2xl"></div>

      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-5 rounded-2xl mb-6 w-20 h-20 flex items-center justify-center relative z-10 group-hover:-translate-y-2 transition-all duration-300">
        <motion.div
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <FaVideo className="w-10 h-10 text-indigo-600" />
        </motion.div>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-indigo-900 relative z-10 group-hover:-translate-y-1 transition-all duration-300">Video Lessons</h3>
      <p className="text-gray-600 relative z-10 group-hover:-translate-y-1 transition-all duration-300">
        Learn through engaging HD videos with expert instructors guiding you step-by-step
      </p>
    </div>
  </div>

  {/* Books Feature Card */}
  <div data-aos="fade-up" data-aos-delay="200" className="group">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 transform scale-0 group-hover:scale-100 transition-all duration-500 rounded-2xl"></div>

      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-5 rounded-2xl mb-6 w-20 h-20 flex items-center justify-center relative z-10 group-hover:-translate-y-2 transition-all duration-300">
        <motion.div
          animate={{ rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <FaBook className="w-10 h-10 text-indigo-600" />
        </motion.div>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-indigo-900 relative z-10 group-hover:-translate-y-1 transition-all duration-300">Digital Books</h3>
      <p className="text-gray-600 relative z-10 group-hover:-translate-y-1 transition-all duration-300">
        Access our curated library of books, guides, and resources from industry experts
      </p>
    </div>
  </div>

  {/* Mind Maps Feature Card */}
  <div data-aos="fade-up" data-aos-delay="300" className="group">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 transform scale-0 group-hover:scale-100 transition-all duration-500 rounded-2xl"></div>

      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-5 rounded-2xl mb-6 w-20 h-20 flex items-center justify-center relative z-10 group-hover:-translate-y-2 transition-all duration-300">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FaProjectDiagram className="w-10 h-10 text-indigo-600" />
        </motion.div>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-indigo-900 relative z-10 group-hover:-translate-y-1 transition-all duration-300">Visual Mind Maps</h3>
      <p className="text-gray-600 relative z-10 group-hover:-translate-y-1 transition-all duration-300">
        Understand complex topics through interactive mind maps that connect key concepts
      </p>
    </div>
  </div>

  {/* Community Feature Card */}
  <div data-aos="fade-up" data-aos-delay="400" className="group">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 transform scale-0 group-hover:scale-100 transition-all duration-500 rounded-2xl"></div>

      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-5 rounded-2xl mb-6 w-20 h-20 flex items-center justify-center relative z-10 group-hover:-translate-y-2 transition-all duration-300">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaUsers className="w-10 h-10 text-indigo-600" />
        </motion.div>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-indigo-900 relative z-10 group-hover:-translate-y-1 transition-all duration-300">Active Community</h3>
      <p className="text-gray-600 relative z-10 group-hover:-translate-y-1 transition-all duration-300">
        Connect with peers, mentors, and experts in real-time discussions and forums
      </p>
    </div>
  </div>
</div>
      </div>

      {/* Custom Scrollbar */}
      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #4f46e5, #9333ea);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #4338ca, #7e22ce);
          }
        `}
      </style>
    </div>
  );
};

export default Home;