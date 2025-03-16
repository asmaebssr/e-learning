export const learningPaths = [
  {
    category: "web-development",
    subcategory: "frontend",
    description: "Learn to build beautiful, responsive user interfaces with modern frontend technologies",
    technologies: [
      {
        name: "HTML",
        description: "The standard markup language for creating web pages and web applications",
        icon: "/icons/html.svg",
        resources: [
          {
            type: "video",
            title: "HTML Crash Course for Beginners",
            url: "https://example.com/html-crash-course",
            description: "Learn HTML basics in under an hour",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "HTML & CSS: Design and Build Websites",
            url: "https://example.com/html-css-book",
            description: "A comprehensive guide to HTML and CSS",
            difficulty: "beginner"
          },
          {
            type: "mindmap",
            title: "HTML Elements Reference",
            url: "https://example.com/html-mindmap",
            description: "Visual guide to all HTML elements",
            difficulty: "intermediate"
          }
        ]
      },
      {
        name: "CSS",
        description: "The style sheet language used for describing the presentation of a document",
        icon: "/icons/css.svg",
        resources: [
          {
            type: "video",
            title: "CSS Fundamentals",
            url: "https://example.com/css-fundamentals",
            description: "Master the basics of CSS",
            difficulty: "beginner"
          },
          {
            type: "book",
            title: "CSS Secrets",
            url: "https://example.com/css-secrets",
            description: "Better solutions to common CSS problems",
            difficulty: "intermediate"
          }
        ]
      },
      {
        name: "JavaScript",
        description: "The programming language of the web",
        icon: "/icons/javascript.svg",
        resources: [
          {
            type: "video",
            title: "JavaScript Essentials",
            url: "https://example.com/js-essentials",
            description: "Everything you need to know about JavaScript",
            difficulty: "beginner"
          },
          {
            type: "mindmap",
            title: "JavaScript Ecosystem",
            url: "https://example.com/js-ecosystem",
            description: "Navigate the JavaScript landscape",
            difficulty: "intermediate"
          }
        ]
      }
    ]
  },
  {
    category: "web-development",
    subcategory: "backend",
    description: "Learn to build scalable server-side applications and APIs",
    technologies: [
      {
        name: "Node.js",
        description: "JavaScript runtime for server-side programming",
        icon: "/icons/nodejs.svg",
        resources: [
          {
            type: "video",
            title: "Node.js for Beginners",
            url: "https://example.com/nodejs-beginners",
            description: "Start building with Node.js",
            difficulty: "beginner"
          }
        ]
      },
      {
        name: "Express",
        description: "Fast, unopinionated, minimalist web framework for Node.js",
        icon: "/icons/express.svg",
        resources: [
          {
            type: "book",
            title: "Express.js Guide",
            url: "https://example.com/expressjs-guide",
            description: "Comprehensive guide to Express.js",
            difficulty: "intermediate"
          }
        ]
      }
    ]
  }
];