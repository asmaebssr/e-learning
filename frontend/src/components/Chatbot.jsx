import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const RealChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant powered by Google Gemini. How can I help you today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const apiKey = "AIzaSyDP0-5AD6TuIbyrdsqHgWNu13UsNLUIDEM"; // Your Gemini API key

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const callGeminiAPI = async (message) => {
    try {
      // Try multiple current Gemini models for better reliability
      const models = [
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash",
        "gemini-1.5-pro-latest",
        "gemini-1.5-pro"
      ];
      
      let response;
      let lastError;
      
      for (const model of models) {
        try {
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
                        text: message
                      }
                    ]
                  }
                ],
                generationConfig: {
                  temperature: 0.7,
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 1024,
                }
              }),
            }
          );
          
          if (response.ok) {
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) {
              return result.candidates[0].content.parts[0].text;
            }
          }
          
          lastError = `Model ${model}: HTTP ${response.status}`;
        } catch (err) {
          lastError = `Model ${model}: ${err.message}`;
          continue; // Try next model
        }
      }

      throw new Error(lastError || "All models failed")
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        return "❌ API authentication issue. Please check your API key.";
      } else if (error.message.includes('429')) {
        return "⏳ Rate limit exceeded. Please try again in a moment.";
      } else if (error.message.includes('500')) {
        return "🔄 Server error. Please try again.";
      }
      return `❌ Error: ${error.message}`;
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    if (!apiKey) {
      const errorMessage = {
        id: messages.length + 1,
        text: "❌ API key not configured. Please contact the administrator.",
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
      const errorMessage = {
        id: messages.length + 2,
        text: "❌ Sorry, I encountered an error. Please try again.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
                <p className="text-white/80 text-xs">
                  {apiKey ? 'Powered by Gemini' : 'Configuration needed'}
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
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                placeholder={apiKey ? "Type your message..." : "Configuration needed..."}
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
      </button>
    </>
  );
};

export default RealChatbot;