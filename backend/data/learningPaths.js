export const learningPaths = [
 {
    category: "frontend-development",
    subcategory: "frontend",
    description: "Learn to build beautiful, responsive user interfaces with modern frontend technologies.",
    technologies: [
      {
        name: "HTML",
        description: "The standard markup language for creating web pages and web applications.",
        icon: "/icons/html.svg",
        resources: [
          {
            type: "video",
            title: "HTML Crash Course for Beginners",
            url: "https://www.youtube.com/watch?v=UB1O30fR-EE",
            description: "Learn HTML basics in under an hour.",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "HTML & CSS: Design and Build Websites",
            url: "https://www.htmlandcssbook.com",
            description: "A beginner-friendly book on HTML and CSS.",
            difficulty: "beginner"
          },
          {
            type: "mindmap",
            title: "HTML Tags Mindmap",
            url: "https://example.com/html-tags-mindmap",
            description: "Overview of commonly used HTML tags.",
            difficulty: "intermediate"
          }
        ]
      },
      {
        name: "CSS",
        description: "The style sheet language used for describing the presentation of a document.",
        icon: "/icons/css.svg",
        resources: [
          {
            type: "video",
            title: "CSS Flexbox in 20 Minutes",
            url: "https://www.youtube.com/watch?v=JJSoEo8JSnc",
            description: "Quick guide to mastering flexbox.",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "CSS Secrets",
            url: "https://www.oreilly.com/library/view/css-secrets/9781449372736/",
            description: "Tips for solving tricky CSS problems.",
            difficulty: "intermediate"
          },
          {
            type: "mindmap",
            title: "CSS Cheat Sheet",
            url: "https://example.com/css-mindmap",
            description: "Quick reference to CSS syntax and properties.",
            difficulty: "beginner"
          }
        ]
      },
      {
        name: "JavaScript",
        description: "The programming language of the web.",
        icon: "/icons/javascript.svg",
        resources: [
          {
            type: "video",
            title: "JavaScript Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
            description: "Learn JavaScript from scratch.",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "Eloquent JavaScript",
            url: "https://eloquentjavascript.net",
            description: "A modern introduction to JavaScript.",
            difficulty: "intermediate"
          },
          {
            type: "mindmap",
            title: "JS Concepts Map",
            url: "https://example.com/js-mindmap",
            description: "Map of core JavaScript concepts.",
            difficulty: "intermediate"
          }
        ]
      },
      {
        name: "React",
        description: "A JavaScript library for building user interfaces.",
        icon: "/icons/react.svg",
        resources: [
          {
            type: "video",
            title: "React Full Course",
            url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
            description: "Comprehensive course on React.js.",
            difficulty: "intermediate"
          },
          {
            type: "book",
            title: "Fullstack React",
            url: "https://www.fullstackreact.com",
            description: "A practical book on building React apps.",
            difficulty: "advanced"
          },
          {
            type: "mindmap",
            title: "React Architecture Map",
            url: "https://example.com/react-mindmap",
            description: "Visual overview of a React app structure.",
            difficulty: "intermediate"
          }
        ]
      }
    ]
  },
  {
    category: "backend-development",
    subcategory: "backend",
    description: "Learn to build scalable server-side applications and APIs.",
    technologies: [
      {
        name: "Node.js",
        description: "JavaScript runtime for server-side programming.",
        icon: "/icons/nodejs.svg",
        resources: [
          {
            type: "video",
            title: "Node.js Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
            description: "Start building backends with Node.js.",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "Node.js Design Patterns",
            url: "https://www.oreilly.com/library/view/nodejs-design-patterns/9781783287314/",
            description: "Advanced Node.js patterns and architecture.",
            difficulty: "advanced"
          }
        ]
      },
      {
        name: "Express",
        description: "Fast, unopinionated, minimalist web framework for Node.js.",
        icon: "/icons/express.svg",
        resources: [
          {
            type: "video",
            title: "Express.js Crash Course",
            url: "https://www.youtube.com/watch?v=L72fhGm1tfE",
            description: "Build a REST API with Express.",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "Pro Express.js",
            url: "https://www.apress.com/gp/book/9781484200383",
            description: "Build powerful web apps with Express.",
            difficulty: "intermediate"
          }
        ]
      },
      {
        name: "MongoDB",
        description: "A NoSQL database for modern applications.",
        icon: "/icons/mongodb.svg",
        resources: [
          {
            type: "video",
            title: "MongoDB Tutorial",
            url: "https://www.youtube.com/watch?v=ofme2o29ngU",
            description: "Introduction to MongoDB and CRUD operations.",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "MongoDB: The Definitive Guide",
            url: "https://www.oreilly.com/library/view/mongodb-the-definitive/9781491954454/",
            description: "Detailed guide to using MongoDB.",
            difficulty: "advanced"
          }
        ]
      }
    ]
  },
  {
    category: "fullstack-development",
    subcategory: "fullstack",
    description: "Master both frontend and backend technologies to build complete web applications.",
    technologies: [
      {
        name: "MERN Stack",
        description: "MongoDB, Express.js, React, and Node.js stack for fullstack development.",
        icon: "/icons/mern.svg",
        resources: [
          {
            type: "video",
            title: "MERN Stack Tutorial",
            url: "https://www.youtube.com/watch?v=7CqJlxBYj-M",
            description: "Build a fullstack app with the MERN stack.",
            difficulty: "intermediate"
          },
          {
            type: "book",
            title: "Full-Stack React Projects",
            url: "https://www.packtpub.com/product/full-stack-react-projects-second-edition/9781839215414",
            description: "Build real-world projects with the MERN stack.",
            difficulty: "advanced"
          }
        ]
      }
    ]
  },
  {
    category: "ui-design",
    subcategory: "ui",
    description: "Learn the principles of user interface design to create visually appealing and user-friendly applications.",
    technologies: [
      {
        name: "Figma",
        description: "Collaborative interface design tool.",
        icon: "/icons/figma.svg",
        resources: [
          {
            type: "video",
            title: "Figma Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=FTFaQWZBqQ8",
            description: "Learn the basics of Figma for UI design.",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "Refactoring UI",
            url: "https://refactoringui.com/book/",
            description: "Practical tips for improving UI design.",
            difficulty: "intermediate"
          }
        ]
      }
    ]
  },
  {
    category: "ux-design",
    subcategory: "ux",
    description: "Understand user experience design to create intuitive and user-centered applications.",
    technologies: [
      {
        name: "User Research",
        description: "Techniques for understanding user needs and behaviors.",
        icon: "/icons/user-research.svg",
        resources: [
          {
            type: "video",
            title: "UX Research Tutorial",
            url: "https://www.youtube.com/watch?v=Ovj4hFxko7c",
            description: "Learn how to conduct UX research.",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "Don't Make Me Think",
            url: "https://www.sensible.com/dmmt.html",
            description: "A common sense approach to web usability.",
            difficulty: "beginner"
          }
        ]
      }
    ]
  },
   {
    category: "mobile-development",
    subcategory: "mobile",
    description: "Develop applications for mobile devices using various frameworks and tools.",
    technologies: [
      {
        name: "React Native",
        description: "Framework for building native apps using React.",
        icon: "/icons/react-native.svg",
        resources: [
          {
            type: "video",
            title: "React Native Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=0-S5a0eXPoc",
            description: "Learn to build mobile apps with React Native.",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "Learning React Native",
            url: "https://www.oreilly.com/library/view/learning-react-native/9781491929001/",
            description: "A hands-on guide to building apps with React Native.",
            difficulty: "intermediate"
          }
        ]
      }
    ]
  },
];
