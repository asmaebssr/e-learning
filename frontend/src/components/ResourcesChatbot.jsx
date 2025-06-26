import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const ResourcesChatbot = ({ learningPaths = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your learning resources assistant. I can help you find videos, books, and mindmaps from our collection. Ask me about any technology, difficulty level, or resource type!",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [apiKey, setApiKey] = useState("AIzaSyDP0-5AD6TuIbyrdsqHgWNu13UsNLUIDEM");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Function to create context about learning resources
  const createResourcesContext = () => {
    let context = "You are a helpful learning resources assistant. Here's information about our available learning resources:\n\n";
    
    learningPaths.forEach(path => {
      context += `**${path.category.toUpperCase()} - ${path.subcategory.toUpperCase()}**\n`;
      context += `Description: ${path.description}\n\n`;
      
      path.technologies.forEach(tech => {
        context += `Technology: ${tech.name}\n`;
        context += `Description: ${tech.description}\n`;
        context += `Resources:\n`;
        
        tech.resources.forEach(resource => {
          context += `- ${resource.type.toUpperCase()}: "${resource.title}" (${resource.difficulty})\n`;
          context += `  URL: ${resource.url}\n`;
          context += `  Description: ${resource.description}\n`;
        });
        context += "\n";
      });
      context += "---\n\n";
    });

    context += `
Instructions for responses:
- Always be helpful and specific about the resources available
- When recommending resources, include the title, type (video/book/mindmap), difficulty level, and a brief description
- If asked about a specific technology, list all available resources for it
- If asked about difficulty levels, filter resources accordingly
- If asked about resource types, focus on that type (videos, books, or mindmaps)
- Always provide URLs when mentioning specific resources
- Be encouraging and supportive about learning
- If you don't have information about something specific, say so clearly
- Keep responses concise but informative
`;

    return context;
  };

  const callGeminiAPI = async (message) => {
    try {
      const resourcesContext = createResourcesContext();
      const fullMessage = resourcesContext + "\n\nUser Question: " + message;

      const models = [
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro"
      ];
      
      let response;
      let lastError;
      
      for (const model of models) {
        try {
          console.log(`Trying model: ${model}`);
          
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: fullMessage
                      }
                    ]
                  }
                ],
                generationConfig: {
                  temperature: 0.3, // Lower temperature for more focused responses
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 1024,
                },
                safetySettings: [
                  {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                  },
                  {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                  },
                  {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                  },
                  {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                  }
                ]
              }),
            }
          );
          
          if (response.ok) {
            const result = await response.json();
            console.log(`Success with model: ${model}`, result);
            
            if (result.candidates && result.candidates.length > 0) {
              const content = result.candidates[0].content;
              if (content && content.parts && content.parts.length > 0) {
                return content.parts[0].text;
              }
            }
            
            lastError = `Model ${model}: No valid content in response`;
            continue;
          } else {
            const errorData = await response.text();
            console.error(`Model ${model} failed:`, response.status, errorData);
            lastError = `Model ${model}: HTTP ${response.status} - ${errorData}`;
          }
          
        } catch (err) {
          console.error(`Model ${model} error:`, err);
          lastError = `Model ${model}: ${err.message}`;
          continue;
        }
      }

      throw new Error(lastError || "All models failed");
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      if (error.message.includes('401') || error.message.includes('403')) {
        return "❌ API authentication failed. Please check your API key and ensure it has proper permissions.";
      } else if (error.message.includes('429')) {
        return "⏳ Rate limit exceeded. Please try again in a moment.";
      } else if (error.message.includes('500')) {
        return "🔄 Server error. Please try again later.";
      } else if (error.message.includes('404')) {
        return "❌ Model not found. The API may have changed or your account may not have access to these models.";
      }
      
      return `❌ Error: ${error.message}`;
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    if (!apiKey) {
      setShowApiKeyInput(true);
      const errorMessage = {
        id: messages.length + 1,
        text: "❌ API key not configured. Please enter your Gemini API key below.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await callGeminiAPI(currentInput);
      
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "❌ Sorry, I encountered an error. Please try again or check the console for details.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Quick suggestion buttons
  const quickSuggestions = [
    "Show me React resources",
    "What JavaScript videos do you have?",
    "Beginner HTML resources",
    "Advanced books available",
    "All mindmaps",
    "Backend development resources"
  ];

  const handleQuickSuggestion = (suggestion) => {
    setInputValue(suggestion);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Resources Assistant</h3>
                <p className="text-white/80 text-xs">
                  {learningPaths.length} learning paths loaded
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="p-3 bg-gray-50 border-b">
              <p className="text-xs text-gray-600 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-1">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-200`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                    message.isBot
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-200">
                <div className="bg-white px-3 py-2 rounded-xl shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            {/* API Key Input */}
            {showApiKeyInput && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <label className="block text-xs font-medium text-yellow-800 mb-1">
                  Enter your Gemini API Key:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    placeholder="AIza..."
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 px-2 py-1 border border-yellow-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                  <button
                    onClick={() => setShowApiKeyInput(false)}
                    disabled={!apiKey.trim()}
                    className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
                </p>
              </div>
            )}
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                placeholder={apiKey ? "Ask about our learning resources..." : "API key needed..."}
                disabled={!apiKey}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping || !apiKey}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group hover:scale-110"
      >
        {isOpen ? (
          <X className="text-xl transition-transform duration-200" />
        ) : (
          <MessageCircle className="text-xl transition-transform duration-200" />
        )}

        {/* Status Indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
          apiKey ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <span className="text-white text-xs font-bold">
            {apiKey ? '✓' : '!'}
          </span>
        </div>

        {/* Resource Count Badge */}
        {learningPaths.length > 0 && (
          <div className="absolute -bottom-1 -left-1 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {learningPaths.reduce((total, path) => total + path.technologies.reduce((techTotal, tech) => techTotal + tech.resources.length, 0), 0)}
          </div>
        )}
      </button>
    </>
  );
};

export default ResourcesChatbot;