import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ArrowLeft, Users, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const Communities = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [subcategoryInfo, setSubcategoryInfo] = useState(null);
  const [showMembersMobile, setShowMembersMobile] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { subcategory } = useParams();
  const socketRef = useRef();
  const messagesEndRef = useRef();
  const emojiPickerRef = useRef();
  const user = useSelector(state => state.auth.user.user);

  useEffect(() => {
    // Fetch subcategory info
    const fetchSubcategoryInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/communities/subcategories`);
        const subcategoryData = response.data.find(item => item.slug === subcategory);
        setSubcategoryInfo(subcategoryData);
      } catch (error) {
        console.error('Error fetching subcategory info:', error);
      }
    };

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/communities/${subcategory}/messages`,
          { withCredentials: true }
        );
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    // Fetch members
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/communities/${subcategory}/members`,
          { withCredentials: true }
        );
        setMembers(response.data.members || []);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    // Check membership status
    const checkMembership = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/communities/${subcategory}/membership`,
            { withCredentials: true }
          );
          setIsMember(response.data.isMember);
        } catch (error) {
          console.error('Error checking membership:', error);
        }
      }
      setLoading(false);
    };

    fetchSubcategoryInfo();
    fetchMessages();
    fetchMembers();
    checkMembership();

    // Connect to socket.io server
    socketRef.current = io('http://localhost:5000', {
      query: { subcategory }
    });

    // Identify the user once connected
    socketRef.current.on('connect', () => {
      if (user) {
        socketRef.current.emit('userConnected', user);
      }
    });

    // Listen for incoming messages
    socketRef.current.on('message', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    // Listen for updated user list
    socketRef.current.on('users', (connectedUsers) => {
      setOnlineUsers(connectedUsers);
    });

    // Clean up socket connection on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [subcategory, user]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleJoinCommunity = async () => {
    if (!user) return;
    
    setJoinLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/communities/join/${subcategory}`,
        {},
        { withCredentials: true }
      );
      
      setIsMember(true);
      
      // Refresh members list
      const membersResponse = await axios.get(
        `http://localhost:5000/api/communities/${subcategory}/members`,
        { withCredentials: true }
      );
      setMembers(membersResponse.data.members || []);
      
    } catch (error) {
      console.error('Error joining community:', error);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user) return;
    
    setJoinLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/communities/leave/${subcategory}`,
        {},
        { withCredentials: true }
      );
      
      setIsMember(false);
      
      // Refresh members list
      const membersResponse = await axios.get(
        `http://localhost:5000/api/communities/${subcategory}/members`,
        { withCredentials: true }
      );
      setMembers(membersResponse.data.members || []);
      
    } catch (error) {
      console.error('Error leaving community:', error);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && user) {
      const newMessage = {
        content: message,
        sender: user._id,
        senderName: user.username,
        timestamp: new Date().toISOString(),
        subcategory
      };

      // Emit message to server
      socketRef.current.emit('sendMessage', newMessage);
      setMessage('');
    }
  };

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.some(onlineUser => onlineUser._id === userId);
  };

  // Mobile members sidebar toggler
  const toggleMembersSidebar = () => {
    setShowMembersMobile(!showMembersMobile);
  };

  // Loading state with gradient background
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-indigo-500"></div>
          <p className="text-indigo-600 mt-4 font-medium">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 md:p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link to="/communities" className="text-white hover:text-indigo-100 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{subcategoryInfo?.name || subcategory}</h1>
              <div className="flex items-center space-x-2 text-sm text-indigo-100">
                <span>{onlineUsers.length} online</span>
                <span className="w-1 h-1 bg-indigo-100 rounded-full"></span>
                <span>{members.length} members</span>
              </div>
              {subcategoryInfo?.description && (
                <p className="text-sm mt-1 text-indigo-100 max-w-2xl hidden md:block">{subcategoryInfo.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMembersSidebar}
              className="md:hidden flex items-center justify-center p-2 rounded-full bg-indigo-500 hover:bg-indigo-400 transition-colors"
              aria-label="Toggle Members"
            >
              <Users className="w-5 h-5" />
            </button>
            
            {user && (
              <div>
                {isMember ? (
                  <button 
                    onClick={handleLeaveCommunity}
                    disabled={joinLoading}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-md"
                  >
                    {joinLoading ? 'Processing...' : 'Leave Community'}
                  </button>
                ) : (
                  <button 
                    onClick={handleJoinCommunity}
                    disabled={joinLoading}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-md"
                  >
                    {joinLoading ? 'Processing...' : 'Join Community'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Members (Desktop) */}
        <div className="w-64 bg-white overflow-y-auto p-4 shadow-md hidden md:block">
          <div className="mb-6">
            <h2 className="font-bold mb-3 text-indigo-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Online Users ({onlineUsers.length})
            </h2>
            {onlineUsers.length > 0 ? (
              <ul className="space-y-2">
                {onlineUsers.map(u => (
                  <li key={u._id} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-800">{u.username}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No users online</p>
            )}
          </div>
          
          <div>
            <h2 className="font-bold mb-3 text-indigo-600 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Members ({members.length})
            </h2>
            {members.length > 0 ? (
              <ul className="space-y-2">
                {members.map(member => (
                  <li key={member._id} className="flex items-center">
                    <div className={`w-2 h-2 ${isUserOnline(member._id) ? 'bg-green-500' : 'bg-gray-400'} rounded-full mr-2`}></div>
                    <span className="text-gray-800">{member.username}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No members yet</p>
            )}
          </div>
        </div>
        
        {/* Mobile Members Sidebar */}
        {showMembersMobile && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-20 md:hidden">
            <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-lg overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-indigo-600">Community Members</h2>
                  <button 
                    onClick={toggleMembersSidebar}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2 text-indigo-600 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Online Users ({onlineUsers.length})
                  </h3>
                  {onlineUsers.length > 0 ? (
                    <ul className="space-y-2">
                      {onlineUsers.map(u => (
                        <li key={u._id} className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-gray-800">{u.username}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No users online</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-indigo-600 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Members ({members.length})
                  </h3>
                  {members.length > 0 ? (
                    <ul className="space-y-2">
                      {members.map(member => (
                        <li key={member._id} className="flex items-center">
                          <div className={`w-2 h-2 ${isUserOnline(member._id) ? 'bg-green-500' : 'bg-gray-400'} rounded-full mr-2`}></div>
                          <span className="text-gray-800">{member.username}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No members yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-tl-2xl shadow-md">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <MessageSquare className="w-16 h-16 text-indigo-200 mb-4" />
                <p className="font-medium">Be the first to start a conversation!</p>
                <p className="text-sm text-indigo-400 mt-2">Connect with others in this community</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${user && msg.sender === user._id ? 'text-right' : ''}`}
                >
                  <div 
                    className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md ${
                      user && msg.sender === user._id 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-800 shadow-sm'
                    }`}
                  >
                    {(!user || msg.sender !== user._id) && (
                      <div className="font-bold text-sm">{msg.senderName}</div>
                    )}
                    <p className="text-sm md:text-base">{msg.content}</p>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSubmit} className="border-t p-4 bg-white relative">
            <div className="flex rounded-lg shadow-md overflow-hidden">
              <button 
                type="button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="px-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={!isMember}
              >
                😊
              </button>
              
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isMember ? "Type your message..." : "Join the community to send messages"}
                className="flex-1 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!isMember}
              />
              <button 
                type="submit"
                className={`px-6 py-3 font-medium ${
                  isMember 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition-colors`}
                disabled={!isMember}
              >
                Send
              </button>
            </div>
            
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-10">
                <Picker 
                  data={data} 
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                />
              </div>
            )}
            
            {!isMember && user && (
              <p className="text-center mt-2 text-sm text-indigo-500">
                <button 
                  onClick={handleJoinCommunity}
                  className="underline font-medium hover:text-indigo-700"
                >
                  Join this community
                </button> to participate in the discussion
              </p>
            )}
            {!user && (
              <p className="text-center mt-2 text-sm text-indigo-500">
                Sign in to join this community and participate
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Communities;